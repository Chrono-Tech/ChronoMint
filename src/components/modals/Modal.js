import React from 'react'
import { connect } from 'react-redux'
import * as a from '../../redux/ui/modal.js'
import AlertModal from './AlertModal'
import LOCModal from './LOCModal'
import SendToExchangeModal from './SendToExchangeModal'
import IssueLHForm from './IssueLHModal'
import RedeemLHModal from './RedeemLHModal'
import UploadedFileModal from './UploadedFileModal'
import NewPollModal from './NewPollModal'
import PollModal from './poll/PollModal'
import DepositTIMEModal from './DepositTIMEModal'
import OperationsSettingsModal from './OperationsSettingsModal'
import SettingsCBEModal from './settings/CBEAddressModal'
import SettingsTokenViewModal from './settings/TokenViewModal'
import SettingsTokenModal from './settings/TokenModal'
import SettingsOtherContractModal from './settings/OtherContractModal'
import SettingsOtherContractModifyModal from './settings/OtherContractModifyModal'

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
  [a.LOC_TYPE]: LOCModal,
  [a.SEND_TO_EXCHANGE_TYPE]: SendToExchangeModal,
  [a.ALERT_TYPE]: AlertModal,
  [a.ISSUE_LH_TYPE]: IssueLHForm,
  [a.REDEEM_LH_TYPE]: RedeemLHModal,
  [a.UPLOADED_FILE_TYPE]: UploadedFileModal,
  [a.NEW_POLL_TYPE]: NewPollModal,
  [a.POLL_TYPE]: PollModal,
  [a.DEPOSIT_TIME_TYPE]: DepositTIMEModal,
  [a.OPERATIONS_SETTINGS_TYPE]: OperationsSettingsModal,
  [a.SETTINGS_CBE_TYPE]: SettingsCBEModal,
  [a.SETTINGS_TOKEN_VIEW_TYPE]: SettingsTokenViewModal,
  [a.SETTINGS_TOKEN_TYPE]: SettingsTokenModal,
  [a.SETTINGS_OTHER_CONTRACT_TYPE]: SettingsOtherContractModal,
  [a.SETTINGS_OTHER_CONTRACT_MODIFY_TYPE]: SettingsOtherContractModifyModal
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({open, modalType, hideModal, modalProps}: propsType) => {
    return MODAL_COMPONENTS[modalType]
      ? React.createElement(MODAL_COMPONENTS[modalType], {open, hideModal, ...modalProps})
      : null
  }
)
