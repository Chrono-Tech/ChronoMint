/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import LOCModel from 'models/LOCModel'
import { modalsClose } from 'redux/modals/actions'
import { revokeAsset } from 'redux/locs/actions'
import ModalDialogBase from 'components/dialogs/ModalDialogBase/ModalDialogBase'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { getToken } from 'redux/locs/selectors'
import { LHT } from 'dao/LHTDAO'
import TokenModel from 'models/tokens/TokenModel'
import Amount from 'models/Amount'
import LOCRedeemForm from './LOCRedeemForm'

import './LOCRedeemDialog.scss'

function mapStateToProps (state) {
  return {
    token: getToken(LHT)(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  revokeAsset: (amount: Amount, loc: LOCModel) => dispatch(revokeAsset(amount, loc)),
  closeModal: () => dispatch(modalsClose()),
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCRedeemModal extends PureComponent {
  static propTypes = {
    closeModal: PropTypes.func,
    loc: PropTypes.instanceOf(LOCModel),
    revokeAsset: PropTypes.func,
    token: PropTypes.instanceOf(TokenModel),
  }

  handleSubmitSuccess = (amount: number) => {
    this.props.closeModal()
    this.props.revokeAsset(new Amount(this.props.token.addDecimals(amount), LHT), this.props.loc)
  }

  render () {
    const { loc } = this.props
    return (
      <ModalDialogBase
        title={{ value: 'locs.redeemS', asset: loc.currency() }}
        subTitle={(
          <div styleName='balances'>
            <div styleName='label'><Translate value='locs.issueLimit' />:</div>
            <TokenValue
              value={loc.issueLimit()}
              symbol={loc.currency()}
              isInvert
            />
            <div styleName='label'><Translate value='locs.issued' />:</div>
            <TokenValue
              value={loc.issued()}
              symbol={loc.currency()}
              isInvert
            />
          </div>
        )}
      >
        <LOCRedeemForm
          loc={loc}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialogBase>
    )
  }
}

export default LOCRedeemModal
