// TODO MINT-266 New LOC
/* eslint-disable */
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { FlatButton, RaisedButton } from 'material-ui'
import IssueForm, { ISSUE_FORM_NAME } from '../../forms/LOCIssueForm/LOCIssueForm'
import { issueAsset } from '../../../redux/locs/actions'
import ModalBase from '../ModalBase/ModalBase'
import { isPristine, submit } from 'redux-form/immutable'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = state => ({
  isPristine: isPristine(ISSUE_FORM_NAME)(state)
})

const mapDispatchToProps = (dispatch) => ({
  issueAsset: (amount, loc) => dispatch(issueAsset(amount, loc)),
  submitForm: () => dispatch(submit(ISSUE_FORM_NAME))
})

@connect(mapStateToProps, mapDispatchToProps)
class IssueLHModal extends Component {
  handleSubmitClick = () => {
    this.props.submitForm()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  handleSubmitSuccess = (amount: number) => {
    this.handleClose()
    this.props.issueAsset(amount, this.props.loc)
  }

  render () {
    const {open, isPristine, loc} = this.props
    const asset = loc.currencyString()
    const actions = [
      <FlatButton
        label={<Translate value='terms.cancel' />}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={<Translate value='locs.issueS' asset={asset} />}
        primary
        onTouchTap={this.handleSubmitClick}
        disabled={isPristine}
      />
    ]

    return (
      <ModalBase
        title='locs.issueLHT'
        onClose={this.handleClose}
        actions={actions}
        open={open}
      >
        <IssueForm
          loc={loc}
          onSubmitSuccess={this.handleSubmitSuccess}
        />

      </ModalBase>
    )
  }
}

export default IssueLHModal
