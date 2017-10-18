import React from 'react'
import { connect } from 'react-redux'
import * as a from 'redux/ui/modal.js'
import AlertModal from './AlertModal'
import ConfirmTxDialog from '../dialogs/ConfirmTxDialog/ConfirmTxDialog'
import UploadedFileModal from './UploadedFileModal'

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(a.hideModal()),
})

const mapStateToProps = state => {
  const { open, modalType, modalProps } = state.get('modal')
  return {
    open,
    modalType,
    modalProps,
  }
}

type propsType = {
  open: boolean,
  modalType: string,
  hideModal: Function,
  modalProps: Object
}

export const MODAL_COMPONENTS = {
  [a.ALERT_TYPE]: AlertModal,
  [a.CONFIRM_TYPE]: ConfirmTxDialog,
  [a.UPLOADED_FILE_TYPE]: UploadedFileModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(({
  open, modalType, hideModal, modalProps }:
propsType) => MODAL_COMPONENTS[modalType]
  ? React.createElement(MODAL_COMPONENTS[modalType], { open, hideModal, ...modalProps })
  : null)
