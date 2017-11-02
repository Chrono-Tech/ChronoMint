import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addManager, DUCK_ASSETS_MANAGER, removeManager } from 'redux/assetsManager/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import EditManagersBase from 'components/forms/EditManagersBaseForm/EditManagersBaseForm'
import './AssetManagerForm.scss'
import { modalsClose } from 'redux/modals/actions'

function mapStateToProps (state) {
  const {selectedToken, tokensMap} = state.get(DUCK_ASSETS_MANAGER)
  const token = tokensMap.get(selectedToken)

  return {
    token,
    account: state.get(DUCK_SESSION).account,
    managers: token.managersList() || [],
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
    handleAddManager: (token, manager: string) => dispatch(addManager(token, manager)),
    handleRemoveManager: (token, manager) => dispatch(removeManager(token, manager)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AssetManagerForm extends React.Component {
  static propTypes = {
    account: PropTypes.string,
    handleAddManager: PropTypes.func,
    handleRemoveManager: PropTypes.func,
    handleClose: PropTypes.func,
    token: PropTypes.object,
    managers: PropTypes.array,
  }

  handleRemove = (address) => {
    this.props.handleClose()
    this.props.handleRemoveManager(this.props.token, address)
  }

  handleSubmitSuccess = (address) => {
    this.props.handleClose()
    this.props.handleAddManager(this.props.token, address)
  }

  render () {
    return (
      <EditManagersBase
        managers={this.props.managers}
        account={this.props.account}
        onRemove={this.handleRemove}
        onSubmitSuccess={this.handleSubmitSuccess}
      />
    )
  }
}
