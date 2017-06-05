import React from 'react'

import { Paper, FloatingActionButton, FontIcon } from 'material-ui'

import './InfoPartial.scss'

export default class InfoPartial extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        { this.renderItem({ title: 'Time', value1: '1 512 000', value2: '.00124', icon: require('@/assets/img/icn-time.png') }) }
        { this.renderItem({ title: 'Lhus', value1: '1 512 000', value2: '.00124', icon: require('@/assets/img/icn-lhus.png') }) }
        { this.renderItem({ title: 'Eth', value1: '1 512 000', value2: '.00124', icon: require('@/assets/img/icn-eth.png') }) }
        <div styleName="actions">
          { this.renderAction({ icon: 'add' })}
        </div>
      </div>
    )
  }

  renderItem({ title, icon, value1, value2 }) {
    return (
      <div styleName="outer">
        <Paper zDepth={1}>
          <div styleName="inner">
            <div styleName="icon" style={{ backgroundImage: `url("${icon}")` }}></div>
            <div styleName="title">{title}</div>
            <div styleName="value">
              <span styleName="value1">{value1}</span>
              <span styleName="value2">{value2}</span>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  renderAction({ icon }) {
    return (
      <div styleName="item">
        <FloatingActionButton>
          <FontIcon className="material-icons">{icon}</FontIcon>
        </FloatingActionButton>
      </div>
    )
  }
}
