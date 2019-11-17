import React from 'react'
// 导入 Carousel 走马灯
import { Carousel, Flex } from 'antd-mobile';

// 导入 axios
import axios from 'axios'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

import './index.scss'
// 图标 右键 --服务管理器-》mysql -》启动 变绿
export default class Index extends React.Component {
  state = {
    swipers: [],
    imgHeight: 176,
  }
  componentDidMount () {
    // 发送 ajax 获取轮播图数据
    this.getSwiper()
  }

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

  render () {
    return (
      <div className="index">
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
          <Flex.Item>
            <img src={nav1} alt="" />
            <h2>整租</h2>
          </Flex.Item>
          <Flex.Item>
            <img src={nav2} alt="" />
            <h2>整租</h2>
          </Flex.Item>
          <Flex.Item>
            <img src={nav3} alt="" />
            <h2>整租</h2>
          </Flex.Item>
          <Flex.Item>
            <img src={nav4} alt="" />
            <h2>整租</h2>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}