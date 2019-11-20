// 封装 顶部导航公共组件
import React from 'react'

import { withRouter } from 'react-router-dom'
import { NavBar, Icon } from 'antd-mobile'

import Proptype from 'prop-types'

import './navheader.scss'
class NavHeader extends React.Component {
  render () {
    return <NavBar
      className="navbar"
      mode="light"
      icon={< Icon type="left" />}
      onLeftClick={() => this.props.history.go(-1)}
    // rightContent={[
    //   <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
    //   <Icon key="1" type="ellipsis" />,
    // ]}
    >{this.props.children}</NavBar >
  }
}
// 验证类型 使用 prop-types包 要求只能传字符串
// 组件.prop-types={
//   名字：验证规则类型
// }
NavHeader.propTypes = {
  children: Proptype.string
}

// 必须使用 withRouter(组件) 这样才能正常使用路由 history
export default withRouter(NavHeader)