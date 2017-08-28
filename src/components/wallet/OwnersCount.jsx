import React from 'react'
import PropTypes from 'prop-types'
import { I18n } from 'react-redux-i18n'

import './OwnersCount.scss'

class OwnersCount extends React.Component {
  /** @namespace PropTypes.string */
  /** @namespace PropTypes.number */
  /** @namespace PropTypes.object */
  static propTypes = {
    name: PropTypes.string,
    meta: PropTypes.object,
    input: PropTypes.object,
    count: PropTypes.number
  }

  state = {}

  constructor (props) {
    super(props)
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
          <div styleName='ownersCounterLabel'>{I18n.t('wallet.WalletAddEditDialog.Wallet owners')}
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

export default OwnersCount
