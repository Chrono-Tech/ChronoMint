/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { issueAsset } from '@chronobank/core/redux/locs/actions'
import { modalsClose } from 'redux/modals/actions'
import TokenValue from 'components/common/TokenValue/TokenValue'
import LOCModel from '@chronobank/core/models/LOCModel'
import { getToken } from '@chronobank/core/redux/locs/selectors'
import { LHT } from '@chronobank/core/dao/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import Amount from '@chronobank/core/models/Amount'
import ModalDialog from 'components/dialogs/ModalDialog'
import IssueForm from './LOCIssueForm'
import './LOCIssueDialog.scss'

function mapStateToProps (state) {
  return {
    token: getToken(LHT)(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  issueAsset: (amount: Amount, loc: LOCModel) => dispatch(issueAsset(amount, loc)),
  closeModal: () => dispatch(modalsClose()),
})

@connect(mapStateToProps, mapDispatchToProps)
class IssueLHModal extends PureComponent {
  static propTypes = {
    closeModal: PropTypes.func,
    issueAsset: PropTypes.func,
    loc: PropTypes.instanceOf(LOCModel),
    token: PropTypes.instanceOf(TokenModel),
  }

  handleSubmitSuccess = (amount: number) => {
    this.props.closeModal()
    this.props.issueAsset(new Amount(this.props.token.addDecimals(amount), LHT), this.props.loc)
  }

  render () {
    const { loc } = this.props
    const currency = loc.currency()
    return (
      <ModalDialog>
        <div styleName='root'>
          <div styleName='header'>
            <h3 styleName='title'>{<Translate value='locs.issueS' asset={currency} />}</h3>
            <div styleName='balances'>
              <div styleName='label'><Translate value='locs.issueLimit' />:</div>
              <TokenValue
                value={loc.issueLimit()}
                symbol={currency}
                isInvert
              />
              <div styleName='label'><Translate value='locs.issued' />:</div>
              <TokenValue
                value={loc.issued()}
                symbol={currency}
                isInvert
              />
            </div>
          </div>
          <div styleName='content'>
            <IssueForm
              loc={loc}
              onSubmitSuccess={this.handleSubmitSuccess}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}

export default IssueLHModal
