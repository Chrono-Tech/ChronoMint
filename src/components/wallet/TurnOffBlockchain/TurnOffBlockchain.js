/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import ModalDialog from 'components/dialogs/ModalDialog'
import React, { PureComponent } from 'react'
import { Switch } from '@material-ui/core'
import { BLOCKCHAIN_ICONS } from 'assets'
import Button from 'components/common/ui/Button/Button'
import { getBlockchainsList } from '@chronobank/core/redux/persistAccount/selectors'
import {
  DEFAULT_ACTIVE_WALLETS_LIST,
  FORM_BLOCKCHAIN_ACTIVATE,
} from '@chronobank/core/redux/persistAccount/constants'

import { modalsClear, modalsClose } from '@chronobank/core/redux/modals/actions'
import { Field, reduxForm } from 'redux-form/immutable'
import { updateBlockchainsList } from '@chronobank/core/redux/persistAccount/actions'

import { prefix } from './lang'
import './TurnOffBlockchain.scss'

function mapStateToProps (state) {
  const activeList = getBlockchainsList(state)
  const initialBlockchains = DEFAULT_ACTIVE_WALLETS_LIST.reduce((result, item) => {
    result[item] = activeList.includes(item)
    return result
  }, {})

  console.log('initialBlockchains: ', initialBlockchains)

  return {
    activeBlockchainList: getBlockchainsList(state),
    allBlockchainList: DEFAULT_ACTIVE_WALLETS_LIST,
    initialValues: initialBlockchains,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClear: () => dispatch(modalsClear()),
    modalsClose: () => dispatch(modalsClose()),
    handleSubmit: (values) => {
      console.log('handleSubmit: ', values, values.toJSON())
      dispatch(updateBlockchainsList(values))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_BLOCKCHAIN_ACTIVATE })
export default class TurnOffBlockchain extends PureComponent {
  static propTypes = {
    modalsClear: PropTypes.func.isRequired,
    modalsClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    activeBlockchainList: PropTypes.arrayOf(PropTypes.string),
    allBlockchainList: PropTypes.arrayOf(PropTypes.string),
  }

  render () {
    console.log('TurnOffBlockchain: ', this.props)

    const { allBlockchainList } = this.props

    return (
      <ModalDialog>
        <form styleName='content' onSubmit={this.props.handleSubmit}>
          <div styleName='root'>
            <div styleName='content'>
              <div styleName='header'>
                <h3><Translate value={`${prefix}.title`} /></h3>
              </div>
              <div styleName='blockchain-list-container'>
                {allBlockchainList.map((blockchainName) => {
                  console.log('blockchainName: ', blockchainName)
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
      </ModalDialog>
    )
  }
}
