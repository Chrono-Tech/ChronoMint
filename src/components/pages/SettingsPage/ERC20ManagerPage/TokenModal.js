import React, { Component } from 'react'
import { connect } from 'react-redux'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import { Dialog, FlatButton, RaisedButton, CircularProgress } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import TokenForm from './TokenForm'
import TokenModel from '../../../../models/TokenModel'
import { saveToken } from '../../../../redux/settings/erc20Manager/tokens'
import styles from '../../../modals/styles'

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
          label={<Translate value='nav.cancel'/>}
          onTouchTap={this.handleClose}
        />,
        <RaisedButton
          label={label}
          primary
          onTouchTap={this.handleSubmitClick}
        />
      ]

    return (
      <Dialog
        title={<div>
          {label}
          <IconButton style={styles.close} onTouchTap={this.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={styles.container}
        titleStyle={styles.title}
        modal
        open={this.props.open}>

        <TokenForm ref='TokenForm' onSubmit={this.handleSubmit}/>

      </Dialog>
    )
  }
}

export default TokenModal
