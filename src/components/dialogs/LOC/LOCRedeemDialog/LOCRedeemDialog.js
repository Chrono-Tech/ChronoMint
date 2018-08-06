/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import LOCModel from '@chronobank/core/models/LOCModel'
import { modalsClose } from 'redux/modals/actions'
import { revokeAsset } from '@chronobank/core/redux/locs/actions'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { getToken } from '@chronobank/core/redux/locs/selectors'
import { LHT } from '@chronobank/core/dao/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import Amount from '@chronobank/core/models/Amount'
import ModalDialog from 'components/dialogs/ModalDialog'
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
      <ModalDialog>
        <div styleName='root'>
          <div styleName='header'>
            <h3 styleName='title'>{<Translate value='locs.redeemS' asset={loc.currency()} />}</h3>
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
          </div>
          <div styleName='content'>
            <LOCRedeemForm
              loc={loc}
              onSubmitSuccess={this.handleSubmitSuccess}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}

export default LOCRedeemModal
