import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { issueAsset } from 'redux/locs/actions'
import { modalsClose } from 'redux/modals/actions'
import ModalDialogBase from 'components/dialogs/ModalDialogBase/ModalDialogBase'
import TokenValue from 'components/common/TokenValue/TokenValue'
import LOCModel from 'models/LOCModel'
import { getToken } from 'redux/locs/selectors'
import { LHT } from 'dao/LHTDAO'
import TokenModel from 'models/tokens/TokenModel'
import Amount from 'models/Amount'
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
      <ModalDialogBase
        title={{ value: 'locs.issueS', asset: currency }}
        subTitle={(
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
        )}
      >
        <IssueForm
          loc={loc}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialogBase>
    )
  }
}

export default IssueLHModal
