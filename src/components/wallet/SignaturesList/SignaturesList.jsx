import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import { fieldPropTypes } from 'redux-form/immutable'
import { prefix } from './lang'
import './SignaturesList.scss'

export default class SignaturesList extends Component {
  static propTypes = {
    count: PropTypes.number,
    value: PropTypes.number,
    ...fieldPropTypes,
  }

  handleSelect = (index) => () => this.props.input.onChange(index)

  render () {
    const { count, input, meta } = this.props
    const chips = []

    for (let i = 1; i <= count; i++) {
      chips.push((
        <span
          key={i}
          styleName={classnames('chip', { selected: i === input.value })}
          onTouchTap={this.handleSelect(i)}
        >
          {i}
        </span>
      ))
    }

    return (
      <div>
        <div styleName='chips'>
          {chips}
          <Translate
            styleName='of'
            value={`${prefix}.ofOwners`}
            count={count}
          />
        </div>
        {!meta.pristine && (
          <div styleName='error'>{meta.error}</div>
        )}
      </div>
    )
  }
}
