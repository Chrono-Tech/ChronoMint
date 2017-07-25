import React from 'react'
import { connect } from 'react-redux'
import * as a from '../../redux/ui/modal.js'
import AlertModal from './AlertModal'
import ConfirmTxDialog from '../dialogs/ConfirmTxDialog/ConfirmTxDialog'
import SendToExchangeModal from '../dialogs/LOC/LOCSendToExchangeDialog/SendToExchangeDialog'
import UploadedFileModal from './UploadedFileModal'
import NewPollModal from './NewPollModal'
import PollModal from './poll/PollModal'
import OperationsSettingsModal from './OperationsSettingsModal'
import SettingsCBEModal from '../pages/SettingsPage/UserManagerPage/CBEAddressModal'
import TokenModal from '../pages/SettingsPage/ERC20ManagerPage/TokenModal'

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(a.hideModal())
})

const mapStateToProps = (state) => {
  const {open, modalType, modalProps} = state.get('modal')
  return {
    open,
    modalType,
    modalProps
  }
}

type propsType = {
  open: boolean,
  modalType: string,
  hideModal: Function,
  modalProps: Object
}

export let MODAL_COMPONENTS = {
  [a.SEND_TO_EXCHANGE_TYPE]: SendToExchangeModal,
  [a.ALERT_TYPE]: AlertModal,
  [a.CONFIRM_TYPE]: ConfirmTxDialog,
  [a.UPLOADED_FILE_TYPE]: UploadedFileModal,
  [a.NEW_POLL_TYPE]: NewPollModal,
  [a.POLL_TYPE]: PollModal,
  [a.OPERATIONS_SETTINGS_TYPE]: OperationsSettingsModal,
  [a.SETTINGS_CBE_TYPE]: SettingsCBEModal,
  [a.SETTINGS_TOKEN_TYPE]: TokenModal
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({open, modalType, hideModal, modalProps}: propsType) => {
    return MODAL_COMPONENTS[modalType]
      ? React.createElement(MODAL_COMPONENTS[modalType], {open, hideModal, ...modalProps})
      : null
  }
)
