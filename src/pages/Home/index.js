import React from 'react'

import { Route } from 'react-router-dom'

import Index from '../Index'
import Houselist from '../Houselist'
import News from '../News'
import Profile from '../Profile'

import { TabBar } from 'antd-mobile';
import './home.css'
// import News from '../News'
//1 抽象TabBar菜单的数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home/index'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/houselist'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]

export default class Home extends React.Component {
  // 官网state
  state = {
    selectedTab: '/home/index',
    hidden: false, // 显示隐藏
    fullScreen: false,
  }


  renderTabbar () {
    return tabItems.map((item) => {
      return <TabBar.Item
        title={item.title} // 文字
        key={item.path}
        icon={<i className={`iconfont ${item.icon}`}></i>
        }
        selectedIcon={<i className={`iconfont ${item.icon}`}></i>

        }
        selected={this.state.selectedTab === item.path}
        // badge={1} 
        onPress={() => {// 点击
          this.setState({
            selectedTab: item.path,
          });
          // 点击跳转到对应的路由
          this.props.history.push(item.path)
        }}
        data-seed="logId"
      >

      </TabBar.Item>
    })
  }
  render () {
    return <div className="home">
      {/* 我是Home 组件
      <hr /> */}
      {/* <Route path='/home/news' component={News}></Route> */}
      {/* 四个子路由 占位 */}

      <Route path="/home/index" component={Index}></Route>
      <Route path="/home/houselist" component={Houselist}></Route>
      <Route path="/home/news" component={News}></Route>
      <Route path="/home/profile" component={Profile}></Route>
      {/* 底部导航栏 TabBar */}
      <TabBar
        unselectedTintColor="#949494" // 没选中的颜色
        tintColor="#33A3F4" // 选中的颜色
        barTintColor="white" // 背景色
        hidden={this.state.hidden} // 是否隐藏 false
        noRenderContent={true} // true 不渲染内容
      >
        {/* 使用数组循环渲染 tabbar  */}
        {this.renderTabbar()}
      </TabBar>

    </div>
  }
}