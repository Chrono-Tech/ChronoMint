import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IssueForm from './LOCIssueForm'
import { issueAsset } from '../../../../redux/locs/actions'
import ModalDialogBase from '../../ModalDialogBase/ModalDialogBase'
import { modalsClose } from 'redux/modals/actions'
import TokenValue from '../../../dashboard/TokenValue/TokenValue'
import { Translate } from 'react-redux-i18n'
import './LOCIssueDialog.scss'

const mapDispatchToProps = (dispatch) => ({
  issueAsset: (amount, loc) => dispatch(issueAsset(amount, loc)),
  closeModal: () => dispatch(modalsClose())
})

@connect(null, mapDispatchToProps)
class IssueLHModal extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    issueAsset: PropTypes.func,
    loc: PropTypes.object
  }

  handleSubmitSuccess = (amount: number) => {
    this.props.closeModal()
    this.props.issueAsset(amount, this.props.loc)
  }

  render () {
    const {loc} = this.props
    // TODO @dkchv: !!! update LHT
    return (
      <ModalDialogBase
        title={{value: 'locs.issueS', asset: 'LHT'}}
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
        <IssueForm
          loc={loc}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialogBase>
    )
  }
}

export default IssueLHModal
