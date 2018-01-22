import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './SignaturesList.scss'
import { Translate } from 'react-redux-i18n'

export default class SignaturesList extends Component {
  static propTypes = {
    count: PropTypes.number,
    value: PropTypes.number,
    input: PropTypes.object,
  }

  handleSelect = (index) => () => {
    this.props.input.onChange(index)
    // this.props.onSelect(index)
  }

  render () {
    const { count, input } = this.props
    const chips = []

    console.log('--SignaturesList#render', count, input.value)

    for (let i = 1; i <= count; i++) {
      chips.push((
        <span
          key={i}
          styleName={classnames('chip', { selected: i === input.value })}
          onTouchTap={this.handleSelect(i)}
        >
          {i}
          {/*<Translate value='common.sOfs' index={i} count={count} />*/}
        </span>
      ))
    }

    return (
      <div styleName='root'>
        {chips}
        <Translate
          styleName='of'
          value='common.of'
          count={count}
        />
      </div>
    )
  }
}
