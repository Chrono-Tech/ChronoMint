/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { FORM_ADD_NEW_WALLET } from '@chronobank/core/redux/mainWallet/constants'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import { formValueSelector } from 'redux-form/immutable'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import { modalsOpen } from 'redux/modals/actions'
import AddTokenDialog from 'components/dialogs/AddTokenDialog/AddTokenDialog'
import './AddCustomTokenTopButton.scss'

function makeMapStateToProps () {
  const selector = formValueSelector(FORM_ADD_NEW_WALLET)
  const mapStateToProps = (state) => {
    return {
      blockchain: selector(state, 'blockchain'),
      ethWalletType: selector(state, 'ethWalletType'),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddToken: () => dispatch(modalsOpen({
      component: AddTokenDialog,
    })),

  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class AddCustomTokenTopButton extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    ethWalletType: PropTypes.string,
    handleAddToken: PropTypes.func,
  }

  render () {
    const { blockchain, ethWalletType } = this.props
    if (blockchain !== BLOCKCHAIN_ETHEREUM || ethWalletType !== 'CW') {
      return null
    }

    return (
      <Button styleName='buttonWithIcon' onClick={this.props.handleAddToken}>
        <i className='chronobank-icon'>add</i>
        <Translate value='topButtons.addToken' />
      </Button>
    )
  }
}
