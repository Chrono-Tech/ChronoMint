import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import EditManagersBaseForm from 'components/forms/EditManagersBaseForm/EditManagersBaseForm'
import { addManager, DUCK_ASSETS_MANAGER, removeManager } from 'redux/assetsManager/actions'
import { modalsClose } from 'redux/modals/actions'
import './AssetManagerForm.scss'

function mapStateToProps (state) {
  const { selectedToken, tokensMap } = state.get(DUCK_ASSETS_MANAGER)
  const token = tokensMap.get(selectedToken)

  return {
    token,
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

  handleAddManager = (address) => {
    this.props.handleClose()
    this.props.handleAddManager(this.props.token, address)
  }

  render () {
    return (
      <EditManagersBaseForm
        managers={this.props.managers}
        onRemove={this.handleRemove}
        onSubmitSuccess={this.handleAddManager}
      />
    )
  }
}
