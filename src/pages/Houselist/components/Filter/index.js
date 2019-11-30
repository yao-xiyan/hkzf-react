import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { API } from '../../../../utils/API'

import { getCurrentCity } from '../../../../utils'

import styles from './index.module.css'

// 控制 标题title的高亮
const titleSelectedStatus = {
  area: false,//区域
  mode: false,// 方式
  price: false,//租金
  more: false// 筛选
}
// 默认选中的状态
const selectedValues = {
  area: ['area', null],
  mode: ['null'],
  price: ['null'],
  more: []

}

export default class Filter extends Component {
  state = {
    // 控制是否高亮
    titleSelectedStatus,
    openType: '', // 是否显示 fillterpicker
    filterdata: {}, // 筛选条件
    selectedValues
  }

  componentDidMount () {
    // 发送 ajax 获取 筛选的条件数据
    this.getfilterdata()
  }
  async getfilterdata () {
    // 获取城市 id
    let city = await getCurrentCity()
    //http://localhost:8080/houses/condition?id=AREA%7C88cff55c-aaa4-e2e0
    let data = await API.get('/houses/condition?id=' + city.value)
    console.log('筛选数据 filterdata', data);
    this.setState({
      filterdata: data.data.body
    })

  }

  // 父亲写一个函数
  onTitleClick = (type) => {
    // console.log('父亲的函数', type);
    // 1、点击当前的 应该高亮
    // 2、循环前面你选了 并且有值 要高亮
    // titleSelectedStatus 控制高亮
    // selectedValues 控制值
    let { titleSelectedStatus, selectedValues } = this.state
    let newtitleSelectedStatus = { ...titleSelectedStatus }
    for (let key in newtitleSelectedStatus) {// 循环
      console.log(key); // area mode price more
      if (key === type) {//当前点击的 应该高亮--area===area
        newtitleSelectedStatus[key] = true;//newtitleSelectedStatus[area]=true
        continue;//跳出此次循环 继续下一个
      }
      // 有值的也要高亮
      let selectedVal = selectedValues[key];//值
      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) { //有值 //  高亮
        newtitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {//有值//  高亮
        newtitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {//有值//  高亮
        newtitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {//有值//  高亮
        newtitleSelectedStatus[key] = true
      } else { //不高亮
        newtitleSelectedStatus[key] = false;
      }
    }
    this.setState({
      titleSelectedStatus: newtitleSelectedStatus,
      openType: type // 点击标题修改openType为对应单词 控制是否显示picker
    })

    // 一次判断
    // this.setState({
    //   titleSelectedStatus: {
    //     ...titleSelectedStatus,
    //     [type]: true
    //   },
    //   //  点击标题修改 openType 为对应单词 
    //   openType: type
    // })



  }


  // 取消函数
  onCancel = (type) => {
    let { titleSelectedStatus, selectedValues } = this.state
    let newtitleSelectedStatus = { ...titleSelectedStatus }
    // 判断当前有值的也要高亮
    let selectedVal = selectedValues[type];//值
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) { //有值 //  高亮
      newtitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {//有值//  高亮
      newtitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {//有值//  高亮
      newtitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {//有值//  高亮
      newtitleSelectedStatus[type] = true
    } else { //不高亮
      newtitleSelectedStatus[type] = false;
    }
    // 吧 openType 变成 '' 就隐藏了
    this.setState({
      titleSelectedStatus: newtitleSelectedStatus,
      openType: ''
    })
  }


  // 确认函数
  onSave = (type, val) => {
    console.log('父亲接收到的val选中值', val);
    // 吧确定选择的值  去改掉 默认初始的值
    // 吧 openType 变成 '' 就隐藏了
    // titleSelectedStatus 控制高亮
    // selectedValues 控制值
    let { titleSelectedStatus } = this.state
    let newtitleSelectedStatus = { ...titleSelectedStatus }
    // 判断当前有值的也要高亮
    let selectedVal = val//值
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) { //有值 //  高亮
      newtitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {//有值//  高亮
      newtitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {//有值//  高亮
      newtitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {//有值//  高亮
      newtitleSelectedStatus[type] = true
    } else { //不高亮
      newtitleSelectedStatus[type] = false;
    }
    this.setState({
      titleSelectedStatus: newtitleSelectedStatus, // 加一个选中
      selectedValues: {
        ...this.state.selectedValues,
        [type]: val
      },
      openType: ''
    })
  }

  // 显示 filterpicker  如果点击了标题  只需要吧openType 修改成对应的单词
  renderPicker () {
    let {
      area,
      // characteristi,
      // floor,
      // oriented,
      price,
      rentType,
      // roomType,
      subway } = this.state.filterdata
    let { openType, selectedValues } = this.state
    // 如果点击了 area 区域 mode 方式 priice租金 才显示 否则就不显示
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      // return <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
      let data = [];
      let cols = 0;
      switch (openType) {
        case 'area': // 区域和地铁
          data = [area, subway]
          cols = 3
          break;
        case 'mode': // 方式
          data = rentType
          cols = 1
          break;
        case 'price': // 租金
          data = price
          cols = 1
          break;

        default:
          break;
      }
      // 传入默认值
      let defaultValue = selectedValues[openType]
      // 显示 picker 在这应该判断拿到对应的数据 穿进去显示
      return <FilterPicker
        key={openType}
        defaultValue={defaultValue}
        data={data}
        cols={cols}
        type={openType}
        onCancel={this.onCancel}
        onSave={this.onSave} />
    }
    return null; // 不显示任何东西
  }

  // 显示和 picker 一起的遮罩层
  renderMask () {
    let { openType } = this.state
    // 如果点击了 area 区域 mode 方式 priice租金 才显示 否则就不显示
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return <div className={styles.mask} />
    }

    return null; // 不显示任何东西
  }

  /**
  * -area:{label: "区域", value: "area", children: Array(13)}
   characteristic: 房屋特点 (13) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
   floor:(3) [{…}, {…}, {…}] 楼层
   oriented: 朝向 (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
   -price:(8) 租金 [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
   -rentType: 方式 (3) [{…}, {…}, {…}]
   roomType:(5) 房间类型 [{…}, {…}, {…}, {…}, {…}]
   -subway:'{label: "地铁", value: "subway", children: Array(23)}
  */
  // 显示 filtermore
  renderMore () {
    // 解构数据
    let { characteristic, floor, oriented, roomType } = this.state.filterdata
    // 如果点了筛选 more 就显示 其他隐藏
    let { openType } = this.state
    if (openType === 'more') {
      // 把数据传进去
      let data = {
        characteristic,
        floor,
        oriented,
        roomType
      }
      return <FilterMore
        data={data}
      />
    }
    return null
  }

  render () {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={this.state.titleSelectedStatus}
            onTitleClick={this.onTitleClick}
          />
          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}
          {this.renderPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* {<FilterMore />} */}
          {this.renderMore()}
        </div>
      </div>
    )
  }
}
