// TODO MINT-315 ERC20 Settings Events & Tests
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { FlatButton, RaisedButton, CircularProgress } from 'material-ui'

import ModalBase from '../../../modals/ModalBase/ModalBase'
import TokenForm from './TokenForm'
import TokenModel from '../../../../models/TokenModel'

import { addToken, modifyToken } from '../../../../redux/settings/erc20/tokens/actions'

const mapStateToProps = (state) => ({
  selected: state.get('settingsERC20Tokens').selected,
  isModify: !!state.get('settingsERC20Tokens').selected.address(),
  isFetching: state.get('settingsERC20Tokens').formFetching
})

const mapDispatchToProps = (dispatch) => ({
  addToken: (token: TokenModel) => dispatch(addToken(token)),
  modifyToken: (oldToken: TokenModel, newToken: TokenModel) => dispatch(modifyToken(oldToken, newToken))
})

@connect(mapStateToProps, mapDispatchToProps)
class TokenModal extends Component {
  handleSubmit = (token: TokenModel) => {
    if (this.props.isModify) {
      this.props.modifyToken(this.props.selected, token)
    } else {
      this.props.addToken(token)
    }
    this.handleClose()
  }

  handleSubmitClick = () => {
    this.tokenForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const label = <Translate value={'settings.erc20.tokens.' + (this.props.isModify ? 'modify' : 'add')}/>
    const actions = this.props.isFetching
      ? <CircularProgress size={24} thickness={1.5}/>
      : [
        <FlatButton
          key='cancel'
          label={<Translate value='terms.cancel'/>}
          onTouchTap={this.handleClose}
        />,
        <RaisedButton
          key='submit'
          label={label}
          primary
          onTouchTap={this.handleSubmitClick}
        />
      ]

    return (
      <ModalBase
        title={label}
        isNotI18n={true}
        onClose={this.handleClose}
        actions={actions}
        open={this.props.open}>

        <TokenForm ref={i => { this.tokenForm = i }} onSubmit={this.handleSubmit}/>

      </ModalBase>
    )
  }
}

export default TokenModal
