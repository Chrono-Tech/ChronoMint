export default {
  nav: {
    project: 'ChronoMint',
    dashboard: 'Панель CBE',
    locs: 'Управление LOC',
    lhOperations: 'LH операции',
    operations: 'Операции',
    settings: 'Настройки',
    wallet: 'Кошелек',
    exchange: 'Обмен',
    voting: 'Голосование',
    rewards: 'Награды',
    profile: 'Профайл',
    signOut: 'Выйти',
    search: 'Искать...',
    actions: 'Действия',
    view: 'Просмотр',
    remove: 'Удалить'
  },
  wallet: {
    sendTokens: 'Отправить токены',
    recipientAddress: 'Адрес получателя'
  },
  exchange: {
    tokens: 'Обмен токенов',
    rates: 'Обменные курсы',
    exchange: 'Обменять',
    buyPrice: 'Цена покупки',
    sellPrice: 'Цена продажи'
  },
  // common one-word terms
  terms: {
    account: 'Аккаунт',
    amount: 'Количество',
    currency: 'Валюта',
    asset: 'Актив',
    hash: 'Хэш',
    time: 'Время',
    value: 'Объем',
    buying: 'Купить',
    selling: 'Продать',
    block: 'Блок',
    action: 'Действие',
    balances: 'Счета',
    fee: 'Комиссия',
    send: 'Отправить'
  },
  operations: {
    pending: 'В ожидании',
    completed: 'Завершенные',
    desc: 'Описание',
    signs: 'Осталось подписать',
    sign: 'Подписать',
    revoke: 'Отозвать'
  },
  tx: {
    transactions: 'Транзакции',
    blockNumber: 'Номер блока',
    loadMore: 'Загрузить еще с %{block} блока',
    noTransactions: 'Нет транзакций',
    UserManager: {
      addCBE: {
        title: 'Добавить CBE',
        name: 'Имя',
        address: 'Адрес'
      }
    }
  },
  errors: {
    cantSentToYourself: 'Невозможно отправить токены самому себе',
    notEnoughTokens: 'Недостаточно токенов',
    invalidCurrencyNumber: 'Значение должно содержать 2 знака после запятой',
    invalidPositiveNumber: 'Должно быть положительным числом',
    invalidURL: 'Некорректный адрес',
    invalidEmail: 'Некорректный е-майл',
    invalidLength: 'Не меньше 3-х символов',
    invalidAddress: 'Некорректный Ethereum адрес',
    required: 'Обязательное поле',
    greaterThanAllowed: 'Значение больше допустимого',
    lowerThan: 'Должно быть меньше чем %{limit}',
    greaterOrEqualBuyPrice: 'Должно быть больше или равно цены покупки'
  }
}
