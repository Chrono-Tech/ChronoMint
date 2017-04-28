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
};

export let MODAL_COMPONENTS = {}
MODAL_COMPONENTS[a.LOC_TYPE] = LOCModal
MODAL_COMPONENTS[a.SEND_TO_EXCHANGE_TYPE] = SendToExchangeModal
MODAL_COMPONENTS[a.ALERT_TYPE] = AlertModal
MODAL_COMPONENTS[a.ISSUE_LH_TYPE] = IssueLHForm
MODAL_COMPONENTS[a.REDEEM_LH_TYPE] = RedeemLHModal
MODAL_COMPONENTS[a.UPLOADED_FILE_TYPE] = UploadedFileModal
MODAL_COMPONENTS[a.NEW_POLL_TYPE] = NewPollModal
MODAL_COMPONENTS[a.POLL_TYPE] = PollModal
MODAL_COMPONENTS[a.DEPOSIT_TIME_TYPE] = DepositTIMEModal
MODAL_COMPONENTS[a.SETTINGS_CBE_TYPE] = SettingsCBEModal
MODAL_COMPONENTS[a.SETTINGS_TOKEN_VIEW_TYPE] = SettingsTokenViewModal
MODAL_COMPONENTS[a.SETTINGS_TOKEN_TYPE] = SettingsTokenModal
MODAL_COMPONENTS[a.SETTINGS_OTHER_CONTRACT_TYPE] = SettingsOtherContractModal
MODAL_COMPONENTS[a.SETTINGS_OTHER_CONTRACT_MODIFY_TYPE] = SettingsOtherContractModifyModal

export default connect(mapStateToProps, mapDispatchToProps)(
  ({open, modalType, hideModal, modalProps}: propsType) => {
    return MODAL_COMPONENTS[modalType]
      ? React.createElement(MODAL_COMPONENTS[modalType], {open, hideModal, ...modalProps})
      : null
  }
)
