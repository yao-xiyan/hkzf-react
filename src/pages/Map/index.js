import React from 'react'
import './map.scss'
// import { NavBar, Icon } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'

import styles from './map.module.css'
import { getCurrentCity } from '../../utils'

import { Toast } from 'antd-mobile'

import axios from 'axios'
// react 中 使用百度地图 不能直接用 BMap 需要使用 window.BMap
let BMap = window.BMap
export default class Map extends React.Component {

  state = {
    count: 0, // 房子总数
    houselist: [], // 房子列表
    isShowList: false
  }

  componentDidMount () {

    // 必须保证页面有这个元素了
    this.initMap()
  }
  async initMap () {
    // 需要根据 当前城市 显示地图
    let city = await getCurrentCity()
    console.log('city城市', city);

    // 初始化一个地图
    // 全局变量
    this.map = new BMap.Map("container")


    // 创建地址解析器实例     
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(city.label, (point) => {
      if (point) {
        // point 就是 城市 经纬度
        this.map.centerAndZoom(point, 11); // 显示地图并缩放
        this.map.addOverlay(new BMap.Marker(point));// 在地图上标记红点
        this.map.addControl(new BMap.NavigationControl()); // 缩放
        this.map.addControl(new BMap.ScaleControl()); // 比例尺
        // map.addControl(new BMap.OverviewMapControl());    
        // map.addControl(new BMap.MapTypeControl());     // 地图卫星
        this.renderOverlay(city.value, 'cycle')

      }
    },
      city.label);


    // // 设置中心点坐标
    // var point = new BMap.Point(116.404, 39.915) //经纬度
    // // 显示地图并缩放
    // map.centerAndZoom(point, 11); // 11 显示区 13 显示镇  15 显示街道
    // 发送 ajax 去获取 北京的 所有区有多少套房子
  }

  // 封装 发送请求生成很多覆盖物 
  async renderOverlay (id, type) {
    Toast.loading('正在加载中...', 0)
    let data = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    Toast.hide()
    // console.log('房源数据', data);

    // 返回的数据
    // coord:{ latitude: "39.912338", longitude: "116.449979" }
    // count:561
    // label:"朝阳"
    // value:"AREA|69cc5f6d-4f29-a77c"
    // 循环数据 生成很多覆盖物
    data.data.body.forEach((item) => {
      // 添加覆盖物 我们在地图上画一些 圆形
      // 创建覆盖物
      // latitude 维度   longitude 经度
      let {
        coord: { latitude, longitude },
        label: cityName, // 改名
        value,
        count
      } = item
      // let point = new BMap, Point(经度, 维度)
      let point = new BMap.Point(longitude, latitude)
      var opts = {
        position: point,    // 指定文本标注所在的地理位置
        offset: new BMap.Size(0, 0)    //设置文本偏移量
      }
      var label = new BMap.Label("", opts);  // 创建文本标注对象
      // 判断 需要话圆形还是矩形
      if (type === 'cycle') { //圆形div 区镇样式
        // 给覆盖物添加内容
        label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">${cityName}</p>
            <p>${count}套</p>
          </div>
        `)
      } else if (type === 'rect') {// 矩形 div 街道小区
        // 给覆盖物添加内容
        label.setContent(`
                        <div class="${styles.rect}">
                            <span class="${styles.housename}">${cityName}</span>
                            <span class="${styles.housenum}">${count}套</span>
                            <i class="${styles.arrow}"></i>
                        </div>
                    `)
      }
      // 给覆盖物添加样式
      label.setStyle({
        border: 0,
        padding: 0
      });
      // 给覆盖物绑定点击事件
      label.addEventListener('click', (e) => {
        console.log('覆盖物的id', value);
        console.log('当前缩放', this.map.getZoom());
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

          console.log("这里要发送ajax 去获取街道小区的 房子列表")
          // 移动地图到中心店位置
          let clickX = e.changedTouches[0].clientX
          let clickY = e.changedTouches[0].clientY
          // 中心点y=（屏幕高度-房子列表高）/2
          // 中心点x = 屏幕宽度/2
          let centerX = window.innerWidth / 2
          let centerY = (window.innerHeight - 330) / 2

          // 移动的距离
          let distanceX = centerX - clickX
          let distanceY = centerY - clickY

          console.log(distanceX, distanceY);
          // 移动地图
          this.map.panBy(distanceX, distanceY)
          this.gethouselist(value)
          return;
        }

      }, 0)
      // 添加到地图覆盖物
      this.map.addOverlay(label);
    })

    // 绑定地图移动事件
    this.map.addEventListener('movestart', () => {
      // 隐藏 房屋列表
      this.setState({
        isShowList: false
      })
    })
  }

  // 发送 ajax 获取房子列表
  gethouselist = async (id) => {
    Toast.loading('正在加载中...', 0)
    let data = await axios.get('http://localhost:8080/houses?cityId=' + id)
    Toast.hide()
    console.log('房子列表', data);
    this.setState({
      count: data.data.body.count,
      houselist: data.data.body.list,
      // 显示列表
      isShowList: true
    })
    // // 显示列表
    // this.setState({

    // })
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
      {/* < NavBar
        className="navbar"
        mode="light"
        icon={< Icon type="left" />}
        onLeftClick={() => this.props.history.go(-1)}
      // rightContent={[
      //   <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
      //   <Icon key="1" type="ellipsis" />,
      // ]}
      > 地图找房</NavBar > */}
      {/* 封装导航栏 */}
      <NavHeader>地图找房·</NavHeader>
      {/* 准备个盒子 放地图 */}
      <div id="container">

      </div>
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
        {/* 大盒子 */}
        <div className={styles.houseItems}>
          {/* hose 每一项 */}
          {this.renderhouselist()}
        </div>
      </div>
    </div>
  }
}