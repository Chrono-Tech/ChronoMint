/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { BLOCKCHAIN_ICONS } from 'assets'
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
  }

  render () {
    const { handleSubmit, allBlockchainList, onHandleSubmitSuccess } = this.props

    return (
      <div styleName='root'>
        <form onSubmit={handleSubmit(onHandleSubmitSuccess)}>
          <div styleName='header'>
            <h3><Translate value={`${prefix}.title`} /></h3>
          </div>
          <div styleName='header-description'>
            <span styleName='text'><Translate value={`${prefix}.description`} /></span>
          </div>
          <div styleName='body'>
            <div styleName='root'>
              <div styleName='content'>
                <div styleName='blockchain-list-container'>
                  {allBlockchainList.map((blockchainName) => {
                    return (
                      <div styleName='blockchain-row' key={`blc-${blockchainName}`}>
                        <div styleName='row-label'>
                          <img styleName='row-icon-image' src={BLOCKCHAIN_ICONS[blockchainName]} />
                          <span styleName='row-label-text'>{blockchainName}</span>
                        </div>
                        <div styleName='row-switch'>
                          <Field
                            styleName='blockchain-checkbox-field'
                            component={Switch}
                            name={blockchainName}
                            color='primary'
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div styleName='finish'>
            <Button
              styleName='save-button'
              type='submit'
              buttonType='login'
              label={<Translate value={`${prefix}.saveButtonTitle`} />}
            />
          </div>
        </form>
      </div>
    )
  }
}

export default BlockchainChoice

