import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatButton, RaisedButton, CircularProgress } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import TokenForm from './TokenForm'
import TokenModel from '../../../../models/TokenModel'
import { saveToken } from '../../../../redux/settings/erc20Manager/tokens'
import ModalBase from '../../../modals/ModalBase/ModalBase'

const mapStateToProps = (state) => ({
  isModify: !!state.get('settingsERC20Tokens').selected.address(),
  isFetching: state.get('settingsERC20Tokens').formFetching
})

const mapDispatchToProps = (dispatch) => ({
  save: (token: TokenModel) => dispatch(saveToken(token))
})

@connect(mapStateToProps, mapDispatchToProps)
class TokenModal extends Component {
  handleSubmit = (token: TokenModel) => {
    this.props.save(token)
    this.handleClose()
  }

  handleSubmitClick = () => {
    this.refs.TokenForm.getWrappedInstance().submit()
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
          label={<Translate value='terms.cancel'/>}
          onTouchTap={this.handleClose}
        />,
        <RaisedButton
          label={label}
          primary
          onTouchTap={this.handleSubmitClick}
        />
      ]

    return (
      <ModalBase
        title={label}
        onClose={this.handleClose}
        actions={actions}
        open={this.props.open}>

        <TokenForm ref='TokenForm' onSubmit={this.handleSubmit}/>

      </ModalBase>
    )
  }
}

export default TokenModal
