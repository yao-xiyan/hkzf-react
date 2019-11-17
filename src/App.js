import React from 'react';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// import { Button } from "antd-mobile"
import Home from './pages/Home';
import Citylist from './pages/Citylist';
import Map from './pages/Map'



function App () {
  return <Router>
    <div className="App">
      {/* 匹配重定向到 /home/index */}
      <Route
        exact // 精确匹配 只有当 / 才跳转
        path="/"
        render={() => {
          return <Redirect to="/home/index"></Redirect>
        }}
      ></Route>
      {/* 配置 /home <Route path='/路径' component={Home}></Route> */}
      <Route path='/home' component={Home}></Route>
      {/* 城市列表 /citylist */}
      <Route path='/citylist' component={Citylist}></Route>

      <Route path='/map' component={Map}></Route>

      {/* <Button type="primary">primary</Button> */}

    </div>
  </Router>

}

export default App;
