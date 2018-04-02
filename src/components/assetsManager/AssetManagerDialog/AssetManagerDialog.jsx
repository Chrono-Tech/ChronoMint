import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import AssetManagerForm from './AssetManagerForm'

function prefix (token) {
  return 'Assets.AssetManagerForm.' + token
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class AssetManagerDialog extends PureComponent {
  static propTypes = {
    modalsClose: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.modalsClose()
  }

  render () {
    return (
      <ModalDialog title={<Translate value={prefix('dialogTitle')} />}>
        <AssetManagerForm onSubmitSuccess={this.handleSubmitSuccess} />
      </ModalDialog>
    )
  }
}
