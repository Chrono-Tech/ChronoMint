/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClear, modalsClose } from '@chronobank/core/redux/modals/actions'
import { updateBlockchainActivity } from '@chronobank/core/redux/persistAccount/actions'
import { reduxForm, Field } from 'redux-form/immutable'
import { Switch } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import AccountProfileModel from '@chronobank/core/models/wallet/persistAccount/AccountProfileModel'
import {
  FORM_CREATE_ACCOUNT,
} from '../../redux/constants'
import './BlockchainChoise.scss'

function mapStateToProps (state) {
  const activeList = getBlockchainList(state)
  const initialBlockchains = DEFAULT_ACTIVE_BLOCKCHAINS.reduce((result, item) => {
    result[item] = activeList.includes(item)
    return result
  }, {})

  return {
    allBlockchainList: DEFAULT_ACTIVE_BLOCKCHAINS,
    initialValues: initialBlockchains,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClear: () => dispatch(modalsClear()),
    modalsClose: () => dispatch(modalsClose()),
    updateBlockchains: (values) => {
      dispatch(updateBlockchainActivity(values.toJS()))
      dispatch(modalsClose())
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_BLOCKCHAIN_ACTIVATE })
class BlockchainChoice extends PureComponent {
  static propTypes = {
    navigateToSelectWallet: PropTypes.func,
    accountProfile: PropTypes.instanceOf(AccountProfileModel),
  }

  render () {
    const { handleSubmit } = this.props

    return (
      <form styleName='content' onSubmit={handleSubmit(updateBlockchains)}>
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
            <div styleName='row-save-button'>
              <Button
                styleName='save-button'
                type='submit'
                label={<Translate value={`${prefix}.saveButtonTitle`} />}
              />
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default reduxForm({ form: FORM_CREATE_ACCOUNT, validate })(BlockchainChoice)

