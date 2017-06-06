import * as user from '../dao/UserManagerDAO'
import * as vote from '../dao/VoteDAO'
import * as erc20 from '../dao/ERC20DAO'
import * as operations from '../dao/PendingManagerDAO'
import * as time from '../dao/TIMEHolderDAO'
import * as rewards from '../dao/RewardsDAO'

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
    actions: 'Действия'
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
    sellPrice: 'Цена продажи',
    limits: 'Ограничения на обмен'
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
    send: 'Отправить',
    search: 'Поиск',
    status: 'Статус',
    website: 'Website',
    sendS: 'Send %{s}',
    save: 'Сохранить',
    cancel: 'Отменить',
    view: 'Просмотр',
    remove: 'Удалить',
    error: 'Ошибка',
    pending: 'В ожидании'
  },
  operations: {
    completed: 'Завершенные операции с последних 6000 блоков',
    settings: 'Настройки операций',
    desc: 'Описание',
    signs: 'Осталось подписать',
    sign: 'Подписать',
    revoke: 'Отозвать',
    emptyPendingList: 'Нет операций, ожидающих подписи.',
    adminCount: 'Кол-во CBE',
    requiredSigns: 'Необходимо подписей',
    errors: {
      duplicate: 'Эта транзакция уже добавлена в список операций, требующих мультиподпись.',
      requiredSigns: 'Кол-во необходимых подписей не должно превышать кол-во CBE.'
    }
  },
  locs: {
    entries: '%{number} записей',
    newLoc: 'Новый LOC',
    sendToExchange: 'Отправить на обмен',
    recent: 'Последние LOC',
    insuranceFee: 'Insurance fee',
    allowedToBeIssued: 'Allowed to be issued',
    expirationDate: 'Expiration Date',
    issuanceParameters: 'Issuance parameters',
    sendLHToExchange: 'Send LH to Exchange',
    title: 'LOC title',
    edit: 'Edit LOC',
    new: 'New LOC',
    delete: 'Delete LOC',
    save: 'Save changes',
    create: 'Create LOC',
    viewContract: 'View Contact',
    editInfo: 'Edit LOC Info',
    daysLeft: 'Дней осталось',
    notice: {
      added: 'Добавлен',
      removed: 'Удален',
      updated: 'Обновлен'
    },
    status: {
      maintenance: 'В разработке',
      active: 'Активный',
      suspended: 'Приостановлен',
      bankrupt: 'Банкрот',
      inactive: 'Неактивный'
    }
  },
  notices: {
    tx: {
      processing: 'Транзакция выполняется...'
    },
    operations: {
      confirmed: 'Операция подтверждена, осталось подписей: %{remained}',
      revoked: 'Операция отозвана, осталось подписей: %{remained}',
      cancelled: 'Операция отменена.'
    }
  },
  tx: {
    transactions: 'Транзакции',
    blockNumber: 'Номер блока',
    loadMore: 'Загрузить еще с %{block} блока',
    noTransactions: 'Нет транзакций',
    UserManager: {
      [user.TX_ADD_CBE]: {
        title: 'Добавить CBE',
        name: 'Имя',
        address: 'Адрес'
      },
      [user.TX_REVOKE_CBE]: {
        title: 'Отозвать CBE',
        name: 'Имя',
        address: 'Адрес'
      },
      [user.TX_SET_REQUIRED_SIGNS]: {
        title: 'Мультиподпись',
        _required: 'Кол-во'
      },
      [user.TX_SET_OWN_HASH]: {
        title: 'Обновить свой профиль',
        name: 'Имя',
        email: 'E-mail',
        company: 'Компания'
      },
      [user.TX_SET_MEMBER_HASH]: {
        title: 'Обновить профиль',
        address: 'Адрес',
        name: 'Имя',
        email: 'E-mail',
        company: 'Компания'
      }
    },
    ContractsManager: {
      // token contracts
      // [tokens.TX_SET_ADDRESS]: {
      //   title: 'Добавить Токен',
      //   address: 'Адрес',
      //   name: 'Имя'
      // },
      // [tokens.TX_CHANGE_ADDRESS]: {
      //   title: 'Изменить Токен',
      //   _from: 'С',
      //   _to: 'На'
      // },
      // [tokens.TX_REMOVE_ADDRESS]: {
      //   title: 'Удалить Токен',
      //   address: 'Адрес',
      //   name: 'Имя'
      // },
      //
      // // assets
      // [tokens.TX_SEND_ASSET]: {
      //   title: 'Послать Актив',
      //   asset: 'Актив',
      //   address: 'Адрес',
      //   amount: 'Объем'
      // },
      // [tokens.TX_REVOKE_ASSET]: {
      //   title: 'Отозвать Актив',
      //   symbol: 'Токен',
      //   value: 'Объем',
      //   loc: 'LOC'
      // },
      // [tokens.TX_REISSUE_ASSET]: {
      //   title: 'Перевыпустить Актив',
      //   symbol: 'Токен',
      //   value: 'Объем',
      //   loc: 'LOC'
      // },
      // [tokens.TX_REQUIRE_TIME]: {
      //   title: 'Запросить TIME'
      // },
      //
      // // common
      // [tokens.TX_CLAIM_CONTRACT_OWNERSHIP]: {
      //   title: 'Заявка на Владение Контрактом',
      //   address: 'Адрес'
      // },

      // other contracts
      // [contracts.TX_SET_OTHER_ADDRESS]: {
      //   title: 'Добавить Контракт',
      //   address: 'Адрес',
      //   name: 'Имя'
      // },
      // [contracts.TX_REMOVE_OTHER_ADDRESS]: {
      //   title: 'Удалить Контракт',
      //   address: 'Адрес',
      //   name: 'Имя'
      // },
      // [contracts.TX_FORWARD]: {
      //   contract: 'Контракт',
      //   address: 'Адрес',
      //
      //   [exchange.TX_SET_PRICES]: 'Установить Цены',
      //   buyPrice: 'Покупка',
      //   sellPrice: 'Продажа'
      // }
    },
    Vote: {
      [vote.TX_ADMIN_END_POLL]: {
        title: 'Окончить Опрос',
        id: 'Id'
      },
      [vote.TX_ACTIVATE_POLL]: {
        title: 'Активировать Опрос',
        id: 'Id'
      }
    },
    ChronoBankAssetProxy: {
      [erc20.TX_APPROVE]: {
        title: 'Одобить TIME',
        account: 'Аккаунт',
        amount: 'Объем'
      },
      [erc20.TX_TRANSFER]: {
        title: 'Перевести TIME',
        recipient: 'Получатель',
        amount: 'Объем'
      }
    },
    ChronoBankAssetWithFeeProxy: {
      [erc20.TX_APPROVE]: {
        title: 'Одобрить LHT',
        account: 'Аккаунт',
        amount: 'Объем'
      },
      [erc20.TX_TRANSFER]: {
        title: 'Перевести LHT',
        recipient: 'Получатель',
        amount: 'Объем'
      }
    },
    PendingManager: {
      [operations.TX_CONFIRM]: {
        title: 'Подтвердить Операцию'
      },
      [operations.TX_REVOKE]: {
        title: 'Отозвать Операцию'
      }
    },
    TimeHolder: {
      [time.TX_DEPOSIT]: {
        title: 'Внести TIME',
        amount: 'Объем'
      },
      [time.TX_WITHDRAW_SHARES]: {
        title: 'Вывести TIME',
        amount: 'Объем'
      }
    },
    Rewards: {
      [rewards.TX_WITHDRAW_REWARD]: {
        title: 'Вывести Вознаграждение',
        amount: 'Объем'
      },
      [rewards.TX_CLOSE_PERIOD]: {
        title: 'Закрыть Период Вознаграждений'
      }
    }
  },
  errors: {
    cantSentToYourself: 'Невозможно отправить токены самому себе',
    notEnoughTokens: 'Недостаточно токенов',
    platformNotEnoughTokens: 'Недостаточно для продажи',
    invalidCurrencyNumber: 'Должен иметь максимум %{decimals} знаков после запятой',
    invalidPositiveNumber: 'Должно быть положительным числом',
    invalidURL: 'Некорректный адрес',
    invalidEmail: 'Некорректный е-майл',
    invalidLength: 'Не меньше 3-х символов',
    invalidAddress: 'Некорректный Ethereum адрес',
    required: 'Обязательное поле',
    greaterThanAllowed: 'Значение больше допустимого',
    lowerThan: 'Должно быть меньше чем %{limit}',
    greaterOrEqualBuyPrice: 'Должно быть больше или равно цены покупки',
    fileUploadingError: 'Could\'t upload file',
    alreadyExist: '%{what} уже существует'
  },
  forms: {
    selectFile: 'Please select a file',
    fileUploading: 'File uploading',
    mustBeCoSigned: 'This operation must be co-signed by other CBE key holders before it is executed.'
  }
}
