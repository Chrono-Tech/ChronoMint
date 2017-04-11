import React, {Component} from 'react'
import {connect} from 'react-redux'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import {Dialog, FlatButton, RaisedButton} from 'material-ui'
import TokenForm from '../../../components/forms/settings/TokenForm'
import TokenContractModel from '../../../models/contracts/TokenContractModel'
import {treatToken} from '../../../redux/settings/tokens'
import styles from '../styles'

const mapStateToProps = (state) => ({
  token: state.get('settingsTokens').selected /** @see TokenContractModel **/
})

const mapDispatchToProps = (dispatch) => ({
  treatToken: (current: TokenContractModel, newAddress: string) =>
    dispatch(treatToken(current, newAddress, window.localStorage.getItem('chronoBankAccount')))
})

@connect(mapStateToProps, mapDispatchToProps)
class TokenModal extends Component {
  handleSubmit = (values) => {
    this.props.treat(this.props.token, values.get('address'))
    this.handleClose()
  };

  handleSubmitClick = () => {
    this.refs.TokenForm.getWrappedInstance().submit()
  };

  handleClose = () => {
    this.props.hideModal()
  };

  render () {
    const {open} = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={(this.props.token.address() === null ? 'Add' : 'Modify') + ' token'}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
      />
    ]

    return (
      <Dialog
        title={<div>
          {this.props.token.address() === null ? 'Add token'
            : 'Modify address of token ' + this.props.token.symbol() + ' — ' + this.props.token.name()}
          <IconButton style={styles.close} onTouchTap={this.handleClose}><NavigationClose /></IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={styles.container}
        titleStyle={styles.title}
        modal
        open={open}>

        <TokenForm ref='TokenForm' onSubmit={this.handleSubmit} />

      </Dialog>
    )
  }
}

export default TokenModal
