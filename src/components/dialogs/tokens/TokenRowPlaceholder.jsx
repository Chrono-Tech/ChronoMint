import React, { PureComponent } from 'react'
import './TokenRowPlaceholder.scss'

export default class TokenRowPlaceholder extends PureComponent {
  render () {
    return (
      <div styleName='root'>
        <div styleName='icon' />
        <div styleName='info'>
          <div styleName='name' />
          <div styleName='balance' />
        </div>
      </div>
    )
  }
}
