import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  // 渲染标签
  renderFilters (arr) {
    // 高亮类名： styles.tagActive
    return (
      // span 就是每一项方格
      arr.map(item => {
        return < span key={item.value} className={[styles.tag, styles.tagActive].join(' ')} >
          {item.label}
        </span >
      })
    )
  }

  render () {
    // 接受传来的参数
    // characteristic 房屋特点, floor 楼层, oriented 朝向, roomType 房间类型
    let data = this.props.data
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
