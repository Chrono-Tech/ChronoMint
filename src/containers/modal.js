/* @flow */
import React from 'react'
import {connect} from 'react-redux'
import {
  hideModal,
  PROMPT_TYPE,
  ALERT_TYPE,
  LOC_TYPE,
  SEND_TO_EXCHANGE_TYPE,
  SIGNATURES_NUMBER_TYPE,
  ISSUE_LH_TYPE,
  REDEEM_LH_TYPE,
  UPLOADED_FILE_TYPE,
  NEW_POLL_TYPE,
  POLL_TYPE,
  DEPOSIT_TIME_TYPE,
  SETTINGS_CBE_TYPE,
  SETTINGS_TOKEN_VIEW_TYPE,
  SETTINGS_TOKEN_TYPE,
  SETTINGS_OTHER_CONTRACT_TYPE,
  SETTINGS_OTHER_CONTRACT_MODIFY_TYPE,
  IPFS_TYPE
} from '../redux/ui/modal.js'
import PromptPassword from '../components/modals/prompt_password'
import AlertModal from '../components/modals/AlertModal'
import LOCModal from '../components/modals/LOCModal'
import SendToExchangeModal from '../components/modals/SendToExchangeModal'
import ChangeNumberSignaturesModal from '../components/modals/ChangeNumberSignaturesModal'
import IssueLHForm from '../components/modals/IssueLHModal'
import RedeemLHModal from '../components/modals/RedeemLHModal'
import UploadedFileModal from '../components/modals/UploadedFileModal'
import NewPollModal from '../components/modals/NewPollModal'
import PollModal from '../components/modals/poll/PollModal'
import DepositTimeModal from '../components/modals/DepositTimeModal'
import SettingsCBEModal from '../components/modals/settings/CBEAddressModal'
import SettingsTokenViewModal from '../components/modals/settings/TokenViewModal'
import SettingsTokenModal from '../components/modals/settings/TokenModal'
import SettingsOtherContractModal from '../components/modals/settings/OtherContractModal'
import SettingsOtherContractModifyModal from '../components/modals/settings/OtherContractModifyModal'
import IPFSFileUpload from '../components/modals/IPFSFileUpload'

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal())
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
MODAL_COMPONENTS[PROMPT_TYPE] = PromptPassword
MODAL_COMPONENTS[LOC_TYPE] = LOCModal
MODAL_COMPONENTS[SEND_TO_EXCHANGE_TYPE] = SendToExchangeModal
MODAL_COMPONENTS[SIGNATURES_NUMBER_TYPE] = ChangeNumberSignaturesModal
MODAL_COMPONENTS[ALERT_TYPE] = AlertModal
MODAL_COMPONENTS[ISSUE_LH_TYPE] = IssueLHForm
MODAL_COMPONENTS[REDEEM_LH_TYPE] = RedeemLHModal
MODAL_COMPONENTS[UPLOADED_FILE_TYPE] = UploadedFileModal
MODAL_COMPONENTS[NEW_POLL_TYPE] = NewPollModal
MODAL_COMPONENTS[POLL_TYPE] = PollModal
MODAL_COMPONENTS[DEPOSIT_TIME_TYPE] = DepositTimeModal
MODAL_COMPONENTS[SETTINGS_CBE_TYPE] = SettingsCBEModal
MODAL_COMPONENTS[SETTINGS_TOKEN_VIEW_TYPE] = SettingsTokenViewModal
MODAL_COMPONENTS[SETTINGS_TOKEN_TYPE] = SettingsTokenModal
MODAL_COMPONENTS[SETTINGS_OTHER_CONTRACT_TYPE] = SettingsOtherContractModal
MODAL_COMPONENTS[SETTINGS_OTHER_CONTRACT_MODIFY_TYPE] = SettingsOtherContractModifyModal
MODAL_COMPONENTS[IPFS_TYPE] = IPFSFileUpload

export default connect(mapStateToProps, mapDispatchToProps)(
  ({open, modalType, hideModal, modalProps}: propsType) => {
    return MODAL_COMPONENTS[modalType]
      ? React.createElement(MODAL_COMPONENTS[modalType], {open, hideModal, ...modalProps})
      : null
  }
)
