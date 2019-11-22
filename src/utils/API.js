import axios from 'axios'
import { BASE_URL } from './url'

console.log('配置的地址', process.env.REACT_APP_URL);

// 先配置一下 baseURL
// 第一种写法
// axios.defaults.baseURL = 'http://localhost:8080'
// 第二种写法
let API = axios.create({
  baseURL: BASE_URL
})

export { API }