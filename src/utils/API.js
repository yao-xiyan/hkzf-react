import axios from 'axios'

// 先配置一下 baseURL
// 第一种写法
// axios.defaults.baseURL = 'http://localhost:8080'
// 第二种写法
let API = axios.create({
  baseURL: 'http://localhost:8080'
})

export { API }