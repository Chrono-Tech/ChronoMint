/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Assets from 'components/assetsManager/lang'
import Timer from 'components/common/Timer/lang'
import TwoFA from 'components/dialogs/TwoFA/lang'
import UserActiveDialog from 'components/dialogs/UserActiveDialog/lang'
import MultisigWalletForm from 'components/wallet/AddWalletWidget/MultisigWalletForm/lang'
import TimeLockedWalletForm from 'components/wallet/AddWalletWidget/TimeLockedWalletForm/lang'
import WalletSettingsForm from 'components/wallet/AddWalletWidget/WalletSettingsForm/lang'
import UpdateProvideDialog from 'components/dialogs/UpdateProvideDialog/lang'
import OwnersList from 'components/wallet/OwnersList/lang'
import SignaturesList from 'components/wallet/SignaturesList/lang'
import exchange from 'components/exchange/lang'
import EditSignaturesDialog from 'components/dialogs/wallet/EditSignaturesDialog/lang'
import SendTokens from 'components/dashboard/SendTokens/lang'
import * as GasSlider from 'components/common/GasSlider/lang'
import DepositsList from 'components/Deposits/DepositsList/lang'
import Deposit from 'components/Deposits/Deposit/lang'
import TxConfirmations from 'components/common/TxConfirmations/lang'
import WalletWidget from 'components/wallet/WalletWidget/lang'
import WalletWidgetDetail from 'components/wallet/WalletWidgetDetail/lang'
import TokensListWidget from 'components/wallet/TokensListWidget/lang'
import PendingTxWidget from 'components/wallet/PendingTxWidget/lang'
import OwnersListWidget from 'components/wallet/OwnersListWidget/lang'
import AddWalletWidget from 'components/wallet/AddWalletWidget/lang'
import TwoFAWarningWidget from 'components/wallet/TwoFAWarningWidget/lang'
import TwoFaWalletForm from 'components/wallet/TwoFaWalletForm/lang'
import TwoFaEnableForm from 'components/wallet/TwoFaEnableForm/lang'
import TwoFaConfirmModal from 'components/wallet/TwoFaConfirmModal/lang'
import WalletWidgetMini from 'components/wallet/WalletWidgetMini/lang'
import WalletName from 'components/wallet/WalletName/lang'
import DepositWarningWidget from 'components/Deposits/DepositWarningWidget/lang'
import PollEditForm from 'components/voting/PollEditForm/lang'
import Poll from 'components/voting/Poll/lang'
import PollStatus from 'components/voting/PollStatus/lang'
import PublishPollDialog from 'components/dialogs/PublishPollDialog/lang'
import PollDepositWarningWidget from 'components/voting/PollDepositWarningWidget/lang'

export default {
  en: {
    UserActiveDialog: UserActiveDialog.en,
    Timer: Timer.en,
    Assets: Assets.en,
    UpdateProvideDialog: UpdateProvideDialog.en,
    OwnersList: OwnersList.en,
    SignaturesList: SignaturesList.en,
    // TODO @Abdulov refactor this
    components: {
      exchange: exchange.en,
      GasSlider: GasSlider.en,
    },
    TwoFA: TwoFA.en,
    EditSignaturesDialog: EditSignaturesDialog.en,
    SendTokens: SendTokens.en,
    DepositsList: DepositsList.en,
    Deposit: Deposit.en,
    TxConfirmations: TxConfirmations.en,
    WalletWidget: WalletWidget.en,
    WalletWidgetDetail: WalletWidgetDetail.en,
    TokensListWidget: TokensListWidget.en,
    PendingTxWidget: PendingTxWidget.en,
    OwnersListWidget: OwnersListWidget.en,
    AddWalletWidget: AddWalletWidget.en,
    MultisigWalletForm: MultisigWalletForm.en,
    TimeLockedWalletForm: TimeLockedWalletForm.en,
    WalletSettingsForm: WalletSettingsForm.en,
    TwoFAWarningWidget: TwoFAWarningWidget.en,
    TwoFaWalletForm: TwoFaWalletForm.en,
    TwoFaEnableForm: TwoFaEnableForm.en,
    TwoFaConfirmModal: TwoFaConfirmModal.en,
    WalletWidgetMini: WalletWidgetMini.en,
    WalletName: WalletName.en,
    DepositWarningWidget: DepositWarningWidget.en,
    PollEditForm: PollEditForm.en,
    Poll: Poll.en,
    PollStatus: PollStatus.en,
    PublishPollDialog: PublishPollDialog.en,
    PollDepositWarningWidget: PollDepositWarningWidget.en,
  },
}
