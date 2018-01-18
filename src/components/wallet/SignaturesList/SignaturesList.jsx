import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './SignaturesList.scss'

export default class SignaturesList extends Component {
  static propTypes = {
    count: PropTypes.number,
    value: PropTypes.number,
    onSelect: PropTypes.func,
  }

  handleSelect = (index) => () => this.props.onSelect(index)

  render () {
    const { count, value } = this.props
    const chips = []

    console.log('--SignaturesList#render', value, count)

    for (let i = 1; i < count; i++) {
      chips.push((
        <div
          key={i}
          styleName={classnames('chip', { selected: i === value })}
          onTouchTap={this.handleSelect(i)}
        >
          {i}
          {/*<Translate value='common.sOfs' index={i} count={count} />*/}
        </div>
      ))
    }

    return (
      <div styleName='root'>
        {chips}
      </div>
    )
  }
}
