/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Map } from 'immutable'

// Here we have a list of [[ALL]] modals dialogues etc.
// Keep imports alphabetically sorted
import AddPlatformDialog from 'components/assetsManager/AddPlatformDialog/AddPlatformDialog'
import AddTokenDialog from 'components/assetsManager/AddTokenDialog/AddTokenDialog'
import AssetManagerDialog from 'components/assetsManager/AssetManagerDialog/AssetManagerDialog'
import BlacklistDialog from 'components/assetsManager/BlacklistDialog/BlacklistDialog'
import BlockAssetDialog from 'components/assetsManager/BlockAssetDialog/BlockAssetDialog'
import CBEAddressDialog from 'components/dialogs/CBEAddressDialog'
import CBETokenDialog from 'components/dialogs/CBETokenDialog/CBETokenDialog'
import ConfirmTransferDialog from 'components/dialogs/ConfirmTransferDialog/ConfirmTransferDialog'
import ConfirmTxDialog from 'components/dialogs/ConfirmTxDialog/ConfirmTxDialog'
import CopyDialog from 'components/dialogs/CopyDialog/CopyDialog'
import DepositTokensModal from 'components/dashboard/DepositTokens/DepositTokensModal'
import EditManagersDialog from 'components/dialogs/wallet/EditOwnersDialog/EditOwnersDialog'
import EditSignaturesDialog from 'components/dialogs/wallet/EditSignaturesDialog/EditSignaturesDialog'
import LOCDialog from 'components/dialogs/LOC/LOCDialog/LOCDialog'
import LOCIssueDialog from 'components/dialogs/LOC/LOCIssueDialog/LOCIssueDialog'
import LOCRedeemDialog from 'components/dialogs/LOC/LOCRedeemDialog/LOCRedeemDialog'
import LOCStatusDialog from 'components/dialogs/LOC/LOCStatusDialog/LOCStatusDialog'
import MenuAssetsManagerMoreInfo from 'layouts/partials/DrawerMainMenu/MenuAssetsManagerMoreInfo/MenuAssetsManagerMoreInfo'
import NetworkCreateModal from '@chronobank/login-ui/components/NetworkCreateModal/NetworkCreateModal'
import NetworkCreateModalForm from '@chronobank/login-ui/components/NetworkCreateModal/NetworkCreateModalForm/NetworkCreateModalForm'
import NotificationContent from 'layouts/partials/NotificationContent/NotificationContent'
import OperationsSettingsDialog from 'components/dialogs/OperationsSettingsDialog'
import ProfileContent from 'layouts/partials/ProfileContent/ProfileContent'
import PublishPollDialog from 'components/dialogs/PublishPollDialog/PublishPollDialog'
import ReceiveTokenModal from 'components/dashboard/ReceiveTokenModal/ReceiveTokenModal'
import RevokeDialog from 'components/assetsManager/RevokeDialog/RevokeDialog'
import SendTokens from 'components/dashboard/SendTokens/SendTokens'
import TwoFaConfirmModal from 'components/wallet/TwoFaConfirmModal/TwoFaConfirmModal'
import UpdateProfileDialog from 'components/dialogs/UpdateProvideDialog/UpdateProfileDialog'
import UserActiveDialog from 'components/dialogs/UserActiveDialog/UserActiveDialog'
import WalletSettingsForm from 'components/wallet/AddWalletWidget/WalletSettingsForm/WalletSettingsForm'

export default class ModalSelector extends PureComponent {
  // Keep Map alphabetically sorted
  static modalsMap = new Map({
    'AddPlatformDialog': AddPlatformDialog,
    'AddTokenDialog': AddTokenDialog,
    'AssetManagerDialog': AssetManagerDialog,
    'BlacklistDialog': BlacklistDialog,
    'BlockAssetDialog': BlockAssetDialog,
    'CBEAddressDialog': CBEAddressDialog,
    'CBETokenDialog': CBETokenDialog,
    'ConfirmTransferDialog': ConfirmTransferDialog,
    'ConfirmTxDialog': ConfirmTxDialog,
    'CopyDialog': CopyDialog,
    'DepositTokensModal': DepositTokensModal,
    'EditManagersDialog': EditManagersDialog,
    'EditSignaturesDialog': EditSignaturesDialog,
    'LOCDialog': LOCDialog,
    'LOCIssueDialog': LOCIssueDialog,
    'LOCRedeemDialog': LOCRedeemDialog,
    'LOCStatusDialog': LOCStatusDialog,
    'MenuAssetsManagerMoreInfo': MenuAssetsManagerMoreInfo,
    'NetworkCreateModal': NetworkCreateModal,
    'NetworkCreateModalForm': NetworkCreateModalForm,
    'NotificationContent': NotificationContent,
    'OperationsSettingsDialog': OperationsSettingsDialog,
    'ProfileContent': ProfileContent,
    'PublishPollDialog': PublishPollDialog,
    'ReceiveTokenModal': ReceiveTokenModal,
    'RevokeDialog': RevokeDialog,
    'SendTokens': SendTokens,
    'TwoFaConfirmModal': TwoFaConfirmModal,
    'UpdateProfileDialog': UpdateProfileDialog,
    'UserActiveDialog': UserActiveDialog,
    'WalletSettingsForm': WalletSettingsForm,
  })

  static getModal (modalProps) {
    if (!modalProps || !modalProps.componentName) {
      // throw new Error('componentName is mandatory property for the ModalSelector')
      console.warn('ModalSelector Error: Cant\'t display modal by data:', modalProps)
      return null // return null is safe since React 16.x
    }

    const Modal = ModalSelector.modalsMap.get(modalProps.componentName)
    return Modal
      ? <Modal {...modalProps.props} />
      : null // return null is safe since React 16.x
  }

  render () {
    return ModalSelector.getModal(this.props)
  }
}
