import * as Assets from 'components/assetsManager/lang'
import * as Timer from 'components/common/Timer/lang'
import * as Dashboard from 'components/dashboard/lang'
import TwoFA from 'components/dialogs/TwoFA/lang'
import * as UserActiveDialog from 'components/dialogs/UserActiveDialog/lang'
import WalletAddEditForm from 'components/dialogs/wallet/WalletAddDialog/lang'
import OwnersList from 'components/wallet/OwnersList/lang'
import WalletSelectDialog from 'components/dialogs/wallet/WalletSelectDialog/lang'
import * as exchange from 'components/exchange/lang'

export default {
  en: {
    UserActiveDialog: UserActiveDialog.en,
    Timer: Timer.en,
    Dashboard: Dashboard.en,
    Assets: Assets.en,
    WalletAddEditForm: WalletAddEditForm.en,
    WalletSelectDialog: WalletSelectDialog.en,
    OwnersList: OwnersList.en,
    // TODO @Abdulov refactor this
    components: {
      exchange: exchange.en,
    },
    TwoFA: TwoFA.en,
  },
  ru: {
    UserActiveDialog: UserActiveDialog.ru,
    Timer: Timer.ru,
    Dashboard: Dashboard.ru,
    Assets: Assets.ru,
    WalletAddEditForm: WalletAddEditForm.ru,
    WalletSelectDialog: WalletSelectDialog.ru,
    OwnersList: OwnersList.ru,
    // TODO @Abdulov refactor this
    components: {
      exchange: exchange.ru,
    },
    TwoFA: TwoFA.ru,
  },
}
