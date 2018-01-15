import * as Assets from 'components/assetsManager/lang'
import * as Dashboard from 'components/dashboard/lang'
import * as Timer from 'components/common/Timer/lang'
import * as UserActiveDialog from 'components/dialogs/UserActiveDialog/lang'
import * as WalletAddEditForm from 'components/dialogs/wallet/WalletAddEditDialog/lang'
import * as exchange from 'components/exchange/lang'

export default {
  en: {
    UserActiveDialog: UserActiveDialog.en,
    Timer: Timer.en,
    Dashboard: Dashboard.en,
    Assets: Assets.en,
    WalletAddEditForm: WalletAddEditForm.en,
    // TODO @Abdulov refactor this
    components: {
      exchange: exchange.en,
    },
  },
  ru: {
    UserActiveDialog: UserActiveDialog.ru,
    Timer: Timer.ru,
    Dashboard: Dashboard.ru,
    Assets: Assets.ru,
    WalletAddEditForm: WalletAddEditForm.ru,
    // TODO @Abdulov refactor this
    components: {
      exchange: exchange.ru,
    },
  },
}
