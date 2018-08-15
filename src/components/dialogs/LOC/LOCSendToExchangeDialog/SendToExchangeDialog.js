/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import exchangeDAO from '@chronobank/core/dao/ExchangeDAO'
import lhtDAO from '@chronobank/core/dao/LHTDAO'
import { LHT } from '@chronobank/core/dao/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { modalsClose } from 'redux/modals/actions'
import { sendAsset } from '@chronobank/core/redux/locs/actions'
import Amount from '@chronobank/core/models/Amount'
import { getToken } from '@chronobank/core/redux/locs/selectors'
import ModalDialog from 'components/dialogs/ModalDialog'
import SendToExchangeForm from './SendToExchangeForm'

function mapStateToProps (state) {
  return {
    token: getToken(LHT)(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  send: async (amount: Amount) => {
    dispatch(sendAsset(
      new TokenModel({ dao: lhtDAO, blockchain: 'Ethereum' }),
      await exchangeDAO.getAddress(),
      amount,
    ))
  },
  closeModal: () => dispatch(modalsClose()),
})

@connect(mapStateToProps, mapDispatchToProps)
class SendToExchangeModal extends PureComponent {
  static propTypes = {
    send: PropTypes.func,
    closeModal: PropTypes.func,
    allowed: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
  }

  handleSubmitSuccess = (amount: number) => {
    this.props.closeModal()
    this.props.send(new Amount(this.props.token.addDecimals(amount), LHT))
  }

  render () {
    return (
      <ModalDialog title={<Translate value='locs.sendLHToExchange' />}>
        <SendToExchangeForm
          onSubmitSuccess={this.handleSubmitSuccess}
          allowed={this.props.allowed}
        />
      </ModalDialog>
    )
  }
}

export default SendToExchangeModal
