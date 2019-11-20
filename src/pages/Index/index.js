import React from 'react'
// 导入 Carousel 走马灯
import { Carousel, Flex, Grid } from 'antd-mobile';
import { getCurrentCity } from '../../utils/index'
// 导入 axios
import axios from 'axios'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

import '../../index.css'
import './index.scss'
// 图标 右键 --服务管理器-》mysql -》启动 变绿

// 导航菜单的数据
const menus = [
  { name: '整租', imgSrc: nav1, path: '/home/houselist' },
  { name: '合租', imgSrc: nav2, path: '/home/houselist' },
  { name: '地图找房', imgSrc: nav3, path: '/map' },
  { name: '去出租', imgSrc: nav4, path: '/rent/add' }
]

// 原生 js 自带的定位 
// navigator.geolocation.getCurrentPosition((position) => {
//   console.log("position", position);

// })

export default class Index extends React.Component {
  state = {
    swipers: [],
    imgHeight: 176,
    isPlay: false, //默认不轮播
    groups: [], //租房小组数据
    news: [], // 最新资讯
    cityName: '' // 城市名字
  }
  async componentDidMount () {
    // 发送 ajax 获取轮播图数据
    this.getSwiper()
    // 发送 ajax 获取租房小组数据
    this.getGroups()
    // 发送 ajax 获取最新资讯数据
    this.getNews()

    // 根据 ip 获取当前城市
    // 用组件封装的 方法
    let position = await getCurrentCity()

    this.setState({
      cityName: position.label
    })

  }

  // async getCurrentCity () {
  //   // 根据 ip 获取 当前城市
  //   var myCity = new window.BMap.LocalCity();
  //   await myCity.get((result) => {
  //     var cityName = result.name;
  //     // window.map.setCenter(cityName);
  //     // alert("当前定位城市:" + cityName);
  // this.setState({
  //   cityName: cityName.substring(0, cityName.length - 1)
  // })
  //   });
  // }

  // 发送 ajax 获取最新资讯数据

  async getNews () {
    let data = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    console.log('最新资讯数据', data);
    if (data.data.status !== 200) {
      console.log("获取最新资讯数据错误");
      return;
    }
    // 如果成功 赋值 
    this.setState({
      news: data.data.body
    })
  }

  // 发送 ajax 获取租房小组数据
  async getGroups () {
    let data = await axios.get("http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0")
    console.log("租房小组数据", data)
    if (data.data.status !== 200) {
      console.log("获取租房小组数据错误")
      return;
    }
    // 如果成功
    // 赋值
    this.setState({
      groups: data.data.body
    })
    // console.log(this.state.groups);

  }
  // 发送 ajax 获取轮播图数据
  async getSwiper () {
    let data = await axios.get("http://localhost:8080/home/swiper")
    console.log("轮播图数据", data);
    // 解构 吧数据赋值
    this.setState({
      swipers: data.data.body
    }, () => {
      this.setState({ isPlay: true })
    })
  }
  // 渲染轮播图
  renderSwiper () {
    return this.state.swipers.map(val => (
      // 每一个图片
      <a
        key={val.id}
        href="http://www.alipay.com"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://localhost:8080${val.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event('resize'));
            this.setState({ imgHeight: 'auto' });
          }}
        />
      </a>
    ))
  }
  // 循环生成 最新资讯
  renderNews () {
    return this.state.news.map((item) => {
      return <li className="news-item" key={item.id}>
        <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
        <div className="list-right">
          <h2>{item.title}</h2>
          <p>
            <span>{item.from}</span>
            <span>{item.date}</span>
          </p>
        </div>
      </li>
    })
  }
  // 虚幻数组重构整租合租
  renderNav () {
    return menus.map((item) => {
      return (
        <Flex.Item
          key={item.name}
          onClick={() => {
            // 跳转
            this.props.history.push(item.path)
          }}
        >
          <img src={item.imgSrc} alt="" />
          <h2>{item.name}</h2>
        </Flex.Item>
      )
    })
  }

  render () {
    return (
      <div className="index">

        {/* 搜索栏部分 */}
        <Flex className='searchBox'>
          <Flex className='searchLeft'>
            <div
              className='location'
              onClick={() => {
                this.props.history.push('/citylist')
              }}
            >
              <span>{this.state.cityName}</span>
              <i className="iconfont icon-arrow" />
            </div>
            <div
              className='searchForm'
              onClick={() => {
                this.props.history.push('/search')
              }}
            >
              <i className="iconfont icon-seach" />
              <span>请输入小区或地址</span>
            </div>
          </Flex>
          <i className="iconfont icon-map"
            onClick={() => {
              this.props.history.push('/map')
            }}
          />
        </Flex>

        {/* 轮播图 */}
        <Carousel
          autoplay={this.state.isPlay} // autoplay 是否自动播放
          infinite // 无限循环滚动
        // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
        // afterChange={index => console.log('slide to', index)}
        >
          {this.renderSwiper()}
        </Carousel>

        {/* 整租合租 */}
        {/* react 和 vue 有些本地图片是不能直接引入的 */}
        <Flex className="hezu">
          {this.renderNav()}
        </Flex>
        {/* 租房小组 */}
        <div className="groups">
          {/* 头 */}
          <div className="groups-title">
            <h3>租房小组</h3>
            <span>更多</span>
          </div>
          {/* 内容里面 四个*/}
          <Grid
            // 传入的菜单数组数据 
            data={this.state.groups}
            columnNum={2}  // 每行占几列
            activeStyle={true} // 点击后的样式
            hasLine={false} // 不要边框线
            square={false} //不要正方形
            renderItem={(item, index) => { // 渲染每一个各自
              return <Flex key="index" className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            }}
          >
          </Grid>
        </div>

        {/* 最新资讯 */}
        <div className="news">
          {/* 头 */}
          <div className="news-title">
            最新资讯
                    </div>
          {/* 列表 */}
          <ul className="news-list">
            {/* 每一项 */}
            {this.renderNews()}

          </ul>
        </div>


      </div>
    )
  }
}