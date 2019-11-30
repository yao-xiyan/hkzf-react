import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {

  state = {
    values: [] // 空数组
  }
  // 点击 span
  onTagClick = (id) => {
    // 点谁 没有 就加上 有就取消
    let newValues = [...this.state.values]
    if (newValues.indexOf(id) === -1) {
      newValues.push(id)
    } else { // 有的话删除
      // findIndex 查找数组 返回满足条件的哪项的索引
      let index = newValues.findIndex(item => {
        return item = id
      })
      newValues.splice(index, 1)
    }
    console.log("value", newValues);

    // 赋值
    this.setState({
      values: newValues
    })
  }
  // 渲染标签
  renderFilters (arr) {
    // 高亮类名： styles.tagActive
    return (
      // span 就是每一项方格
      arr.map(item => {
        // 数组里面又这个值 那么span就要选中
        let isselected = this.state.values.indexOf(item.value) !== -1
        return < span
          key={item.value}
          // , styles.tagActive
          className={[styles.tag, isselected ? styles.tagActive : ''].join(' ')}
          onClick={() => {
            this.onTagClick(item.value)
          }}
        >
          {item.label}
        </span >
      })
    )
  }

  render () {
    // 接受传来的参数
    // characteristic 房屋特点, floor 楼层, oriented 朝向, roomType 房间类型
    let { data } = this.props
    console.log('接受的data', data);

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(data.roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(data.oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(data.floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(data.characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} />
      </div>
    )
  }
}
