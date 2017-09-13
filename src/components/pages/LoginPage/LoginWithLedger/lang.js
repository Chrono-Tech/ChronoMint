export default {
  en: {
    login: 'Login',
    isHttps: {
      successTitle: 'HTTPS protocol provided',
      errorTitle: 'HTTPS protocol only',
      errorTip: 'Ledger works over HTTPS protocol only'
    },
    isU2F: {
      successTitle: 'U2F supported',
      errorTitle: 'U2F is not supported',
      errorTip: 'LedgerWallet uses U2F which is not supported by your browser. Use Chrome, Opera or Firefox with a U2F extension.'
    }, isETHAppOpened: {
      successTitle: 'Ethereum application found successfully',
      errorTitle: `Ethereum application is not opened`,
      errorTip: `Open 'Ethereum' application on your Ledger and set 'Browser Support' to 'yes' in 'Settings'`
    }, isFetched: {
      successTitle: 'ETH address fetched successfully',
      errorTitle: `Confirm ETH address on Ledger`,
      errorTip: 'Open Ethereum application and confirm address'
    }
  },
  ru: {
    login: 'Авторизоваться',
    isHttps: {
      successTitle: 'Протокол HTTPS предоставлен',
      errorTitle: 'Только протокол HTTPS',
      errorTip: 'Ledger работает только по протоколу HTTPS'
    },
    isU2F: {
      successTitle: 'Поддерживается U2F',
      errorTitle: 'U2F не поддерживается',
      errorTip: 'LedgerWallet использует U2F, который не поддерживается вашим браузером. Используйте Chrome, Opera или Firefox с расширением U2F.'
    }, isETHAppOpened: {
      successTitle: 'Приложение Ethereum найдено успешно',
      errorTitle: `Приложение Ethereum не открывается`,
      errorTip: `Откройте приложение 'Ethereum' в своей книге и установите 'Поддержка браузера' в 'Да' в 'Настройки'`
    }, isFetched: {
      successTitle: 'Адрес ETH успешно выбран',
      errorTitle: `Подтвердить ETH-адрес в Ledger`,
      errorTip: 'Откройте приложение Ethereum и подтвердите адрес'
    }
  },
}

