/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { BLOCKCHAIN_ICONS } from 'assets'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import Button from 'components/common/ui/Button/Button'
import {
  FORM_BLOCKCHAIN_CHOICE_LOGIN_STEP,
} from '@chronobank/core/redux/persistAccount/constants'
import { reduxForm, Field } from 'redux-form/immutable'
import { Switch } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { prefix } from './lang'

import './BlockchainChoice.scss'

@reduxForm({ form: FORM_BLOCKCHAIN_CHOICE_LOGIN_STEP })
class BlockchainChoice extends PureComponent {
  static propTypes = {
    onHandleSubmitSuccess: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    allBlockchainList: PropTypes.arrayOf(PropTypes.string),
    pageType: PropTypes.oneOf(['login', 'main']),
  }

  getBlockchainList = () => {
    const list = [
      {
        blockchain: BLOCKCHAIN_ETHEREUM,
        disabled: true,
      },
    ]

    return list.concat(this.props.allBlockchainList.map((blockchainName) => {
      return {
        blockchain: blockchainName,
        disabled: false,
      }
    }))
  }

  getUpdateButton = () => {
    switch (this.props.pageType) {
      case 'login':
        return (
          <div styleName='finish'>
            <Button
              styleName='save-button'
              type='submit'
              buttonType='login'
              label={<Translate value={`${prefix}.saveButtonTitle`} />}
            />
          </div>
        )
      case 'main':
        return (
          <div styleName='row-save-button'>
            <Button
              styleName='save-button'
              type='submit'
              label={<Translate value={`${prefix}.updateButtonTitle`} />}
            />
          </div>
        )
    }
  }

  render () {
    const { pageType, handleSubmit, onHandleSubmitSuccess } = this.props

    return (
      <div styleName='root'>
        <form onSubmit={handleSubmit(onHandleSubmitSuccess)}>
          {pageType === 'login' &&
          <div styleName='header'>
            <h3><Translate value={`${prefix}.title`} /></h3>
          </div>}
          {pageType === 'login' &&
          <div styleName='header-description'>
            <span styleName='text'><Translate value={`${prefix}.description`} /></span>
          </div>}
          <div styleName='body'>
            <div styleName='root'>
              <div styleName='content'>
                <div styleName='blockchain-list-container'>
                  {this.getBlockchainList().map(({ blockchain, disabled }) => {
                    return (
                      <div styleName='blockchain-row' key={`blc-${blockchain}`}>
                        <div styleName='row-label'>
                          <img styleName='row-icon-image' src={BLOCKCHAIN_ICONS[blockchain]} />
                          <span styleName='row-label-text'>{blockchain}</span>
                        </div>
                        <div styleName='row-switch'>
                          <Field
                            styleName='blockchain-checkbox-field'
                            component={Switch}
                            name={blockchain}
                            color='primary'
                            disabled={disabled}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          {this.getUpdateButton()}
        </form>
      </div>
    )
  }
}

export default BlockchainChoice

