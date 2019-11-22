import React from 'react'
// 导入封装的NavHeader
import NavHeader from '../../components/NavHeader'

import './map.scss'

// 导入局部样式
import styles from './map.module.css'
import { getCurrentCity } from '../../utils/index.js'

import axios from 'axios'
import { Toast } from 'antd-mobile'

console.log("styles", styles)
// react中 使用百度地图 不能直接用BMap 需要使用 window.BMap
let BMap = window.BMap
export default class Map extends React.Component {
  state = {
    houselist: [],//房子列表
    count: 0,//房子总数
    isShowList: false
  }
  componentDidMount () {

    // 必须保证页面有这个元素了
    this.initMap()
  }
  async initMap () {
    //1 需要根据 当前城市  显示地图
    let city = await getCurrentCity()

    console.log("city城市", city)
    //  // 初始化一个地图
    this.map = new BMap.Map("container");
    // 创建地址解析器实例     
    let myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(city.label, (point) => {
      if (point) {

        // point就是 城市的经纬度
        this.map.centerAndZoom(point, 11);  //显示地图并缩放    
        // 添加地图控件
        this.map.addControl(new BMap.NavigationControl()); //缩放
        this.map.addControl(new BMap.ScaleControl());  // 比例尺  
        // map.addControl(new BMap.MapTypeControl()); //地图卫星
        // 发送ajax 去获取 北京的 所有区 和有多少套房子
        this.renderOverlay(city.value, 'cycle')

      }
    },
      city.label);

    //  //  设置中心点坐标
    //  var point = new BMap.Point(116.404, 39.915); //经纬度
    //  // 显示地图并缩放
    //  map.centerAndZoom(point, 11); //11 显示区 13 显示镇 15街道小区 
  }
  // 封装 发送请求生成很多覆盖物
  async renderOverlay (id, type) {
    Toast.loading('正在加载中...', 0)
    let res = await axios.get("http://localhost:8080/area/map?id=" + id)
    Toast.hide()
    console.log("房源数据", res)
    // 循环数据 生成 很多 覆盖物
    res.data.body.forEach((item) => {
      // longitude 经度  latitude纬度
      let {
        coord: { latitude, longitude },
        label: cityName,//改名
        value,
        count
      } = item
      //1 循环一次 创建一个覆盖物
      // 通过经纬度 创建百度坐标
      let point = new BMap.Point(longitude, latitude);
      var opts = {
        position: point,    // 百度坐标
        offset: new BMap.Size(0, 0)    //设置文本偏移量
      }
      var label = new BMap.Label('', opts);
      // 判断 需要画圆形还是矩形
      if (type === 'cycle') {// 圆形div  区镇样式
        label.setContent(`
                        <div class="${styles.bubble}">
                            <p class="${styles.name}">${cityName}</p>
                            <p>${count}套</p>
                        </div>
                    `)
      } else if (type === 'rect') {// 矩形div  街道小区
        label.setContent(`
                        <div class="${styles.rect}">
                            <span class="${styles.housename}">${cityName}</span>
                            <span class="${styles.housenum}">${count}套</span>
                            <i class="${styles.arrow}"></i>
                        </div>
                    `)
      }


      // 这是专门 百度生成那个 外层label标签的样式
      label.setStyle({
        border: 0,
        padding: 0
      });
      // 给覆盖物绑定点击事件
      label.addEventListener("click", (e) => {
        // 区  11  ---镇 13 ---街道小区 15 
        // 如果是 区 11 点击 进入镇 13
        // 如果是 镇 13  点击进入街道小区 15
        // 如果是 街道小区 15  显示房子列表
        console.log("覆盖物的id", value)
        console.log("当前缩放", this.map.getZoom())
        let zoom = this.map.getZoom();// 11 13 15
        if (zoom === 11) {//去13
          // 清除旧的覆盖物  再生成新的
          setTimeout(() => {
            this.map.clearOverlays()
          }, 0)
          // 跳转到大兴  显示大兴的房子
          this.map.centerAndZoom(point, 13)
          // 发送ajax  去获取大兴的数据  循环生成很多覆盖物  显示大兴的房子
          this.renderOverlay(value, 'cycle')
        } else if (zoom === 13) {//去 15
          // 清除旧的覆盖物  再生成新的
          setTimeout(() => {
            this.map.clearOverlays()
          }, 0)
          this.map.centerAndZoom(point, 15)
          this.renderOverlay(value, 'rect')
        } else if (zoom === 15) {// 不进去了 显示房子列表
          this.setState({
            isShowList: true
          })
          console.log("这里要发送ajax 去获取街道小区的 房子列表")
          this.gethouselist(value)
          return;
        }

      })
      //2 添加到地图覆盖物
      this.map.addOverlay(label);
    })
  }
  // 发送ajax 去获取房子列表
  gethouselist = async (id) => {
    let res = await axios.get("http://localhost:8080/houses?cityId=" + id)
    console.log("房子列表", res);
    this.setState({
      count: res.data.body.count,
      houselist: res.data.body.list
    })
  }

  // 渲染房子列表
  renderhouselist () {
    return this.state.houselist.map((item) => {
      return <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img className={styles.img} src={`http://localhost:8080${item.houseImg}`} alt="" />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {/* ['近地铁', '随时看房'] */}
            {item.tags.map((v, i) => {
              // i 索引 01234
              let tagclass = 'tag' + (i + 1)
              return <span key={i} className={[styles.tag, styles[tagclass]].join(' ')} >
                {v}
              </span>
            })}

          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
                        </div>
        </div>
      </div>
    })
  }

  render () {
    return <div className="map">
      {/*  封装导航栏 组件标签之间的内容 叫children */}
      <NavHeader>
        地图找房
            </NavHeader>
      {/* 测试样式 */}
      {/* <div className={styles.xx}>我是map的div</div> */}
      {/* 准备一个div */}
      <div id="container"></div>

      {/* 房子列表 */}
      <div
        className={[styles.houseList, this.state.isShowList ? styles.show : ''].join(' ')}
      >
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="/house/list">
            更多房源
                    </a>
        </div>
        {/* houseItems大盒子 */}
        <div className={styles.houseItems}>
          {/* house每一项 */}
          {this.renderhouselist()}
        </div>
      </div>
    </div>
  }
}
