import React from 'react'
import './map.scss'
// react 中 使用百度地图 不能直接用 BMap 需要使用 window.BMap
let BMap = window.BMap
export default class Map extends React.Component {

  componentDidMount () {

    // 必须保证页面有这个元素了
    this.initMap()
  }
  initMap () {
    // 初始化一个地图
    var map = new BMap.Map("container")
    // 设置中心点坐标
    var point = new BMap.Point(116.404, 39.915) //经纬度
    // 显示地图并缩放
    map.centerAndZoom(point, 11); // 11 显示区 13 显示镇  15 显示街道

  }
  render () {
    return <div className="map">
      {/* 准备个盒子 放地图 */}
      <div id="container">

      </div>
    </div>
  }
}