import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'
import TokenForm from '../../../components/forms/settings/TokenForm'
import TokenContractModel from '../../../models/contracts/TokenContractModel'
import { treatToken } from '../../../redux/settings/tokens'
import { Translate } from 'react-redux-i18n'
import ModalBase from '../ModalBase/ModalBase'

const mapStateToProps = (state) => ({
  token: state.get('settingsTokens').selected /** @see TokenContractModel **/
})

const mapDispatchToProps = (dispatch) => ({
  treat: (current: TokenContractModel, newAddress: string) => dispatch(treatToken(current, newAddress))
})

@connect(mapStateToProps, mapDispatchToProps)
class TokenModal extends Component {
  handleSubmit = (values) => {
    this.props.treat(this.props.token, values.get('address'))
    this.handleClose()
  }

  handleSubmitClick = () => {
    this.refs.TokenForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const actions = [
      <FlatButton
        label={<Translate value='terms.cancel' />}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={(this.props.token.address() === null ? 'Add' : 'Modify') + ' token'}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
      />
    ]

    const title = this.props.token.address() === null
      ? 'Add token'
      : `Modify address of token ${this.props.token.symbol()} — ${this.props.token.name()}`

    return (
      <ModalBase
        title={title}
        onClose={this.handleClose}
        actions={actions}
        open={this.props.open}
      >
        <TokenForm ref='TokenForm' onSubmit={this.handleSubmit} />
      </ModalBase>
    )
  }
}

export default TokenModal
