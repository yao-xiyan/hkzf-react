import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
// import FilterMore from '../FilterMore'

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

export default class Filter extends Component {
  state = {
    // 控制是否高亮
    titleSelectedStatus,
    openType: '', // 是否显示 fillterpicker
    filterdata: {}
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

    this.setState({
      titleSelectedStatus: {
        ...titleSelectedStatus,
        [type]: true
      },
      //  点击标题修改 openType 为对应单词 
      openType: type
    })

  }

  // 取消函数
  onCancel = () => {
    // 吧 openType 变成 '' 就隐藏了
    this.setState({
      openType: ''
    })
  }


  // 确认函数
  onSave = () => {
    // 吧 openType 变成 '' 就隐藏了
    this.setState({
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
    let { openType } = this.state
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
      // 显示 picker 在这应该判断拿到对应的数据 穿进去显示
      return <FilterPicker
        data={data}
        cols={cols}
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
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
