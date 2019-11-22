import React from 'react'

import { Flex } from 'antd-mobile'

import Proptype from 'prop-types'

import { withRouter } from 'react-router-dom'

class SearchHeader extends React.Component {
  render () {
    return <Flex className='searchBox'>
      <Flex className='searchLeft'>
        <div
          className='location'
          onClick={() => {
            this.props.history.push('/citylist')
          }}
        >
          <span>{this.props.cityname}</span>
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
  }
}

SearchHeader.propTypes = {
  cityname: Proptype.string
}

export default withRouter(SearchHeader)