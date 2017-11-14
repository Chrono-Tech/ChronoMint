import React from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'

import './OwnersCount.scss'

export default class OwnersCount extends React.Component {
  /** @namespace PropTypes.string */
  /** @namespace PropTypes.number */
  /** @namespace PropTypes.object */
  static propTypes = {
    name: PropTypes.string,
    meta: PropTypes.object,
    input: PropTypes.object,
    count: PropTypes.number
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.count !== nextProps.count) {
      this.props.input.onChange(nextProps.count)
    }
  }

  render () {
    return (
      <div>
        <div styleName='ownersCounterWrapper'>
          <div styleName='ownersCounterLabel'>
            <Translate value='wallet.walletAddEditDialog.walletOwners' />
            &nbsp;&mdash;&nbsp;
          </div>
          <div styleName='ownersCounterNumber'>{this.props.count}</div>
        </div>
        <div styleName='ownersCounterError'>{this.props.meta.error}</div>
        <input
          {...this.props.input}
          value={this.props.count}
          type='text'
          styleName='hidden'
        />
      </div>
    )
  }
}
