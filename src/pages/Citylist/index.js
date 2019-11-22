import React from 'react'
import { Toast } from 'antd-mobile'
// import axios from 'axios'
import './citylist.scss'

import { AutoSizer, List } from 'react-virtualized';

import NavHeader from '../../components/NavHeader'
// 导入封装的函数
import { getCurrentCity } from '../../utils/index'

// 导入修改后的axios
import { API } from '../../utils/API'
// import { start } from 'repl';

// const list = [];


// for (var i = 0; i < 100; i++) {
//   list.push("我是第 " + i + "条数据");
// }
const HAS_HOUSE = ['北京', '上海', '广州', '深圳']

export default class Citylist extends React.Component {
  listRef = React.createRef()
  state = {
    citylist: {}, //城市列表
    cityindex: [], //字母列表
    activeindex: 0 // 默认0 选中
  }

  componentDidMount () {
    // 发送 ajax 获取城市列表
    this.getCitylist()
  }

  async getCitylist () {
    let data = await API.get('/area/city?level=1')
    console.log('城市列表数据', data);
    // 1、调用函数城市列表 和 字母列表
    let { citylist, cityindex } = this.formatCity(data.data.body)

    // 2、发送 ajax 获取热门城市
    let hotRes = await API.get('/area/hot')

    console.log("热门城市", hotRes);

    citylist.hot = hotRes.data.body
    cityindex.unshift('hot')

    // 3、获取当前定位城市
    let position = await getCurrentCity()
    citylist['#'] = [position]
    // 吧定位城市添加到数组的最前面
    cityindex.unshift('#')
    console.log('定位的城市', position);



    console.log('城市列表citylist', citylist);
    console.log('索引字母列表cityindex', cityindex);

    // 赋值 
    this.setState({
      citylist: citylist,
      cityindex: cityindex
    })
    // 根据 ip 获取 当前城市
    var myCity = new window.BMap.LocalCity();
    await myCity.get((result) => {
      var cityName = result.name;
      // window.map.setCenter(cityName);
      // alert("当前定位城市:" + cityName);
      this.setState({
        cityName: cityName.substring(0, cityName.length - 1)
      })
    });


    // 数据需要改成我们想要的格式
    // let obj = {}
    // data.data.body.forEach((item) => {
    //   // 循环城市列表   把他改造成我们要的数据
    //   // item 就是每一项
    //   let word = item.short.substr(0, 1); //'bj'.substr(0,1)
    //   // 判断有没有这个单词
    //   if (!obj[word]) { // obj['b'] 没有undefined 有
    //     obj[word] = [item] // 没有 b:[北京] 也应该第一次的城市加上去
    //     // obj.b=[北京]
    //   } else {
    //     obj[word].push(item) // 有 就往数组里面追加
    //   }
    // })
    // console.log('修改后的城市数据', obj);

  }

  // 格式化 改造城市列表
  formatCity (list) {
    // 数据 需要改成我们想要的格式
    let citylist = {}
    // 循环城市列表 把他改造储层我们要的数据
    list.forEach((item) => {
      // 循环城市列表   把他改造成我们要的数据
      // item 就是每一项
      let word = item.short.substr(0, 1); //'bj'.substr(0,1)
      // 判断有没有这个单词
      if (!citylist[word]) { // citylist['b'] 没有undefined 有
        citylist[word] = [item] // 没有 b:[北京] 也应该第一次的城市加上去
        // citylist.b=[北京]
      } else {
        citylist[word].push(item) // 有 就往数组里面追加
      }
    })
    let cityindex = Object.keys(citylist).sort(); // 索引字母列表
    // return 出去
    return {
      citylist,
      cityindex
    }
  }
  // 函数写组件里面  渲染的 div 内容
  rowRenderer = ({
    key, // 唯一的key
    index, // 索引 0123...
    isScrolling, // 是否正在滚动 滚动就 true
    isVisible, // 是否可见 true 见到了
    style, // 必须加上 不加没有样式
  }) => {
    // index
    // console.log('index', index)
    let word = this.state.cityindex[index]; // # hot a b c ....
    let citys = this.state.citylist[word]; // 城市数组{ a:[], b: []  } 
    return (
      <div key={key} style={style} className="city">
        <div className="title">{this.formatWord(word)}</div>
        {/* 循环生成对应单词 的城市 */}

        {citys.map((item) => {
          return <div
            className="name"
            key={item.value}
            onClick={() => {
              // 只有北上广深 有房源 没有就提示暂无房源
              if (HAS_HOUSE.indexOf(item.label) === -1) {
                // 暂无房源
                Toast.info('暂无房源')
              } else { // 有房源
                // 先存到 localStorage 
                localStorage.setItem('my-city', JSON.stringify(item))
                // 再跳转到 首页
                this.props.history.push('home/index')
              }
            }}
          >{item.label}</div>
        })}

      </div>
    );
  }

  // 格式化单词
  formatWord = (word) => {
    switch (word) {
      case '#':
        return '定位城市'
      case 'hot':
        return '热门城市'
      default:
        return word.toUpperCase()
    }
  }

  // 动态计算每个盒子的高度
  // 
  getHeight = ({ index }) => {
    let word = this.state.cityindex[index]
    let citys = this.state.citylist[word]
    // 单词的高度 + 城市的高度*城市的数量长度
    return 36 + 50 * citys.length
  }

  // 当滚动的时候
  // overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number
  onRowsRendered = ({ startIndex, stopIndex }) => {
    // console.log(startIndex, stopIndex); 
    // 修改高亮的索引 就高亮了
    if (this.state.activeindex !== startIndex) { //开始的高度
      this.setState({
        activeindex: startIndex
      })
    }

  }

  // NavBar 导航栏
  render () {
    return <div className="citylist">
      {/* 导航栏 */}
      <NavHeader>城市列表</NavHeader>
      {/* rowHeight ({ index: number }): number */}
      {/* 函数  里面有个参数 是对象 有个 index 是数字 number 类型 */}


      {/* 左侧城市列表 */}
      <AutoSizer>
        {/* height width 这个组件会算出全屏的宽高 */}
        {({ height, width }) => {
          return <List
            ref={this.listRef}
            width={width} // 列表宽
            height={height} // 列表高
            scrollToAlignment='start'
            rowCount={this.state.cityindex.length} // 总数据条数
            // 需要动态计算 每一个盒子高度
            rowHeight={this.getHeight} // 每一项高度
            rowRenderer={this.rowRenderer} // 渲染 div 内容
            onRowsRendered={this.onRowsRendered} // 滚动时候
          >
          </List>
        }}
      </AutoSizer>

      {/* 右侧字母列表 */}
      <ul className="city-index">
        {this.state.cityindex.map((item, index) => {
          // console.log(this.state.activeindex, index)
          return <li
            className={this.state.activeindex === index ? 'index-active' : ''}
            key={index}
            onClick={() => {
              // 让列表滚动上去 滚动到对应索引的一行
              console.log("滚到的位置索引", this.listRef.current);
              this.listRef.current.scrollToRow(index)
            }}
          >
            {item === 'hot' ? '热' : item.toUpperCase()}
          </li>
        })}
      </ul>

    </div >
  }
}