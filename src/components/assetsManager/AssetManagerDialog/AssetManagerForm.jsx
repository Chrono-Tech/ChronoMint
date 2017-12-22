import EditManagersBaseForm from 'components/forms/EditManagersBaseForm/EditManagersBaseForm'
import TokenModel from 'models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { addManager, DUCK_ASSETS_MANAGER, removeManager } from 'redux/assetsManager/actions'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import './AssetManagerForm.scss'

function mapStateToProps (state) {
  const { selectedToken } = state.get(DUCK_ASSETS_MANAGER)
  const tokens = state.get(DUCK_TOKENS)
  const token = tokens.item(selectedToken)

  return {
    token,
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
export default class AssetManagerForm extends PureComponent {
  static propTypes = {
    handleAddManager: PropTypes.func,
    handleRemoveManager: PropTypes.func,
    handleClose: PropTypes.func,
    token: PropTypes.instanceOf(TokenModel),
  }

  handleRemove = (address) => {
    this.props.handleClose()
    this.props.handleRemoveManager(this.props.token, address)
  }

  handleAddManager = (address) => {
    this.props.handleClose()
    this.props.handleAddManager(this.props.token, address)
  }

  render () {
    return (
      <EditManagersBaseForm
        managers={this.props.token.managersList()}
        onRemove={this.handleRemove}
        onSubmitSuccess={this.handleAddManager}
      />
    )
  }
}
