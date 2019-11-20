// 封装一下公共函数
// 获取定位城市时候 存到 localStorage
// 以后如果要用就判断localStorage 有 就直接取出来
// 如果没有 就需要 百度定位 获取到城市


// export default 单独的
// export 多个

// 导入 axios
import axios from 'axios'
// 在里面 判断 localStorage 如果有直接用 没有 就用 百度定位
export let getCurrentCity = () => {
  // 判断是否有
  let city = JSON.parse(localStorage.getItem('my-city'))
  if (!city) {
    // 如果没有 就用百度定位
    // 根据 ip 获取 当前城市  resolve成功的函数 reject 失败的函数
    return new Promise((resolve, reject) => {
      var myCity = new window.BMap.LocalCity();
      myCity.get(async (result) => {
        var cityName = result.name;
        // console.log('当前定位城市' + cityName);
        // 发送 ajax 获取定位城市信息
        let data = await axios.get('http://localhost:8080/area/info?name=' + cityName)
        console.log("城市信息", data.data.body);
        // 没有需要存起来  localStorage 只能存字符串
        // JSON.stringify(对象或数组) 把对象或数组转成字符串
        // JSON.parse(字符串) 吧字符串转成对象或数组
        localStorage.setItem('my-city', JSON.stringify(data.data.body))
        resolve(data.data.body)
      });
    })
  } else {
    // 如果有 不要直接返回
    // 为了和上面返回类型一样 我们最好写一个 promise 
    // return new Promise((resolve,reject) => {
    //   resolve(city)
    // })
    // 简写
    return Promise.resolve(city)
  }
} 