import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import Axios from 'axios'
import './citylist.scss'
export default class Citylist extends React.Component {

  componentDidMout () {
    // 发送 ajax 获取城市列表
    this.getCitylist()
  }

  async getCitylist () {
    let data = await Axios.get('http://localhost:8080/area/city?level=1')
    console.log('城市列表数据', data);

  }
  // NavBar 导航栏
  render () {
    return <div>
      <NavBar
        className="navbar"
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => this.props.history.go(-1)}
      // rightContent={[
      //   <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
      //   <Icon key="1" type="ellipsis" />,
      // ]}
      >城市选择</NavBar>
    </div>
  }
}