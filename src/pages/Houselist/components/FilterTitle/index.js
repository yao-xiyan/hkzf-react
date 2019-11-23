import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]
// class 类组件  this.props
// 函数 组件 props是直接在函数参数接收 后面直接用接收props
export default function FilterTitle (props) {
  console.log('props', props)
  // props.xx 拿数据 props.titleSelectedStatus
  let { titleSelectedStatus, onTitleClick } = props
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map((item) => {
        // item.type---area  mode  price四个单词
        let isSelected = titleSelectedStatus[item.type]

        return <Flex.Item key={item.type}
          onClick={() => {
            onTitleClick(item.type)
          }}
        >
          {/* 选中类名： styles.selected */}
          <span
            className={[styles.dropdown, isSelected ? styles.selected : ''].join(' ')}>
            <span>{item.title}</span>
            <i className="iconfont icon-arrow" />
          </span>
        </Flex.Item>
      })}


    </Flex>
  )
}
