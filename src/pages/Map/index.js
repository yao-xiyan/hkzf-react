import React from 'react'
import './map.scss'
// import { NavBar, Icon } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'

import { getCurrentCity } from '../../utils'
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
    var map = new BMap.Map("container")


    // 创建地址解析器实例     
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(city.label, function (point) {
      if (point) {
        map.centerAndZoom(point, 11); // 显示地图并缩放
        map.addOverlay(new BMap.Marker(point));// 在地图上标记红点
      }
    },
      city.label);


    // // 设置中心点坐标
    // var point = new BMap.Point(116.404, 39.915) //经纬度
    // // 显示地图并缩放
    // map.centerAndZoom(point, 11); // 11 显示区 13 显示镇  15 显示街道

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