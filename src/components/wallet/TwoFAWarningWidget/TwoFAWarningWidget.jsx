/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types'
import Button from 'components/common/ui/Button/Button'
import './TwoFAWarningWidget.scss'
import { prefix } from './lang'

function mapStateToProps (state, ownProps) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    handleGoTo2FA: () => dispatch(push('/2fa')),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class TwoFAWarningWidget extends PureComponent {
  static propTypes = {
    handleGoTo2FA: PropTypes.func,
  }

  render () {
    return (
      <div styleName='header-container'>
        <div styleName='wallet-list-container'>

          <div styleName='wallet-container'>
            <div styleName='token-container'>
              <div styleName='subIcon'>
                <div styleName='icon' className='chronobank-icon'>security</div>
              </div>
              <div styleName='token-icon'>
                <div styleName='imageIcon' className='chronobank-icon'>wallet-circle</div>
              </div>
            </div>
            <div styleName='content-container'>
              <div styleName='title'><Translate value={`${prefix}.title`} /></div>
              <div styleName='text'><Translate value={`${prefix}.message`} /></div>
              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.button`} />}
                    onTouchTap={this.props.handleGoTo2FA}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
