import React from 'react'


import SearchHeader from '../../components/SearchHeader'

import './houselist.scss'

import { getCurrentCity } from '../../utils/index'

import Filter from './components/Filter'

export default class Houselist extends React.Component {
  state = {
    cityname: ''
  }
  async componentDidMount () {
    let city = await getCurrentCity()
    this.setState({
      cityname: city.label
    })
  }
  render () {
    return <div className='Houselist'>
      {/* 导航栏 */}
      <div className="search">
        <i className="iconfont icon-back"></i>
        {/* 封装的导航栏 */}
        <SearchHeader cityname={this.state.cityname}></SearchHeader>
      </div>
      {/* 筛选部分 */}
      <Filter></Filter>
    </div>
  }
}