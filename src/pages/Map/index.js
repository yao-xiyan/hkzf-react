import React from 'react'
import './map.scss'
// import { NavBar, Icon } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'

import styles from './map.module.css'
import { getCurrentCity } from '../../utils'

import axios from 'axios'
// react 中 使用百度地图 不能直接用 BMap 需要使用 window.BMap
let BMap = window.BMap
export default class Map extends React.Component {

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

        this.renderOverlay(city.value)

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
  async renderOverlay (id) {
    let data = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    console.log('房源数据', data);

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
      // 给覆盖物添加内容
      label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${cityName}</p>
        <p>${count}套</p>
      </div>
    `)
      // 给覆盖物添加样式
      label.setStyle({
        // cursor: 'pointer',
        // border: '0px solid rgb(255, 0, 0)',
        // padding: '0px',
        // whiteSpace: 'nowrap',
        // fontSize: '12px',
        // textAlign: 'center',
        color: 'rgb(255, 255, 255)'
      });
      // 给覆盖物绑定点击事件
      label.addEventListener('click', (e) => {
        console.log('覆盖物的id', value);

      })
      // 添加到地图覆盖物
      this.map.addOverlay(label);
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
    </div>
  }
}