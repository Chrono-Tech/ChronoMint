import * as user from '../dao/UserManagerDAO'
import * as vote from '../dao/VoteDAO'
import * as erc20 from '../dao/ERC20DAO'
import * as operations from '../dao/PendingManagerDAO'
import * as time from '../dao/TIMEHolderDAO'
import * as rewards from '../dao/RewardsDAO'
import * as loc from '../dao/LOCManagerDAO'

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
    loadMore: 'Загрузить еще',
    markupWallet: 'Кошелёк 2.0'
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
    website: 'Веб-сайт',
    sendS: 'Отправить %{s}',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    save: 'Сохранить',
    cancel: 'Отменить',
    view: 'Просмотр',
    remove: 'Удалить',
    error: 'Ошибка',
    pending: 'В ожидании',
    failed: 'Не выполнено'
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
      // TODO @bshevchenko: move this duplicate error to the common tx errors list
      duplicate: 'Эта транзакция уже добавлена в список операций, требующих мультиподпись.',
      requiredSigns: 'Кол-во необходимых подписей не должно превышать кол-во CBE.'
    }
  },
  locs: {
    entries: '%{number} записей',
    sendToExchange: 'Отправить на обмен',
    recent: 'Последние LOC',
    insuranceFee: 'Insurance fee',
    allowedToBeIssued: 'Ограничение на выпуск',
    expirationDate: 'Дата экспирации',
    issuanceParameters: 'Параметры выпуска',
    sendLHToExchange: 'Отправит LH на обмен',
    uploadedFile: 'Загруженный файл',
    issueLHT: 'Выпустить LHT',
    issueS: 'Выпустить %{asset}',
    redeemLHT: 'Списать LHT',
    redeemS: 'Списать %{asset}',
    title: 'Название LOC',
    edit: 'Редактировать LOC',
    new: 'Новый LOC',
    delete: 'Удалить LOC',
    save: 'Сохранить изменения',
    create: 'Создать LOC',
    viewContract: 'Просмотреть контракт',
    editInfo: 'Редактировать LOC',
    daysLeft: 'Дней осталось',
    updateStatus: 'Обновить статус',
    forms: {
      amountToBeS: 'Значение на %{action}',
      allowedToBeS: 'Ограничение на %{action} от лица %{name}: %{limit} %{currency}',
      actions: {
        issued: 'выпуск',
        redeemed: 'списание'
      }
    },
    notice: {
      added: 'Добавлен',
      removed: 'Удален',
      updated: 'Обновлен',
      statusUpdated: 'Статус обновлен',
      issued: 'Issued'
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
    noTransactions: 'Нет транзакций',
    confirm: 'Подтвердить транзакцию',
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
    },
    LOCManager: {
      [loc.standardFuncs.ADD_LOC]: {
        title: 'Добавить LOC',
        name: 'Имя',
        website: 'Вебсайт',
        issueLimit: 'Лимит выпуска',
        publishedHash: 'Published Hash',
        expDate: 'Дата экспирации',
        currency: 'Валюта'
      },
      [loc.standardFuncs.SET_LOC]: {
        title: 'Обновить LOC',
        name: 'Имя',
        website: 'Вебсайт',
        issueLimit: 'Лимит выпуска',
        publishedHash: 'Published Hash',
        expDate: 'Дата экспирации'
      },
      [loc.multisigFuncs.REMOVE_LOC]: {
        title: 'Удалить LOC',
        name: 'Имя'
      },
      [loc.multisigFuncs.REISSUE_ASSET]: {
        title: 'Выпустить актив',
        amount: 'Объем',
        name: 'Имя'
      },
      [loc.multisigFuncs.REVOKE_ASSET]: {
        title: 'Отозвать актив',
        amount: 'Объем',
        name: 'Имя'
      },
      [loc.multisigFuncs.UPDATE_LOC_STATUS]: {
        title: 'Обновить статус LOC',
        name: 'Имя',
        status: 'Статус'
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
    fileUploadingError: 'Невозможно загрузить файл',
    alreadyExist: '%{what} уже существует',
    transactionErrorTitle: 'Ошибка транзакции',
    transactionErrorMessage: 'Произошла ошибка во время транзакции для %{item}. Ошибка [%{code}]: %{message}'
  },
  forms: {
    selectFile: 'Пожалуйста выберите файл',
    fileUploading: 'Файл загружается',
    mustBeCoSigned: 'This operation must be co-signed by other CBE key holders before it is executed.',
    correspondingFee: 'Corresponding fees will be deducted from this amount'
  },
  errorCodes: {
    MODIFIER_STOPPED: 'Auth error',
    OK: 'OK',
    UNDEFINED: 'Undefined',

    LOC_NOT_FOUND: 'LOC not found',
    LOC_EXISTS: 'LOC exists',
    LOC_INACTIVE: 'LOC inactive',
    LOC_SHOULD_NO_BE_ACTIVE: 'LOC Should be active',
    LOC_INVALID_PARAMETER: 'LOC invalid parameters',
    LOC_INVALID_INVOCATION: 'LOC invalid invocation',
    LOC_ADD_CONTRACT: 'LOC add contract',
    LOC_SEND_ASSET: 'LOC send asset',
    LOC_REQUESTED_ISSUE_VALUE_EXCEEDED: 'LOC requested issue value exceed',
    LOC_REISSUING_ASSET_FAILED: 'LOC reissuing asset failed',
    LOC_REQUESTED_REVOKE_VALUE_EXCEEDED: 'LOC requested revoke value exceed',
    LOC_REVOKING_ASSET_FAILED: 'LOC revoking asset failed',

    USER_NOT_FOUND: 'User not found',
    USER_INVALID_PARAMETER: 'User: invalid request parameters',
    USER_ALREADY_CBE: 'User already CBE',
    USER_NOT_CBE: 'User is not CBE',
    USER_SAME_HASH: 'User has the same hash',
    USER_INVALID_REQURED: 'User: Invalid required',
    USER_INVALID_STATE: 'User: Invalid state',

    CROWDFUNDING_INVALID_INVOCATION: 'Crowdfunding: Invalid invocation',
    CROWDFUNDING_ADD_CONTRACT: 'Crowdfunding: add contract',
    CROWDFUNDING_NOT_ASSET_OWNER: 'Crowdfunding:User is not asset owner',

    PENDING_NOT_FOUND: 'Pending not found',
    PENDING_INVALID_INVOCATION: 'Pending Operation: Invalid invocation',
    PENDING_ADD_CONTRACT: 'Pending add contract',
    PENDING_DUPLICATE_TX: 'Duplicate transaction',
    PENDING_CANNOT_CONFIRM: 'Cannot confirm request',
    PENDING_PREVIOUSLY_CONFIRMED: 'Operation already confirmed',
    PENDING_NOT_ENOUGH_CONFIRMED: 'Operation not enough confirmed',

    STORAGE_INVALID_INVOCATION: 'Storage invalid invocation',

    EXCHANGE_INVALID_PARAMETER: 'Exchange: Invalid request parameter',
    EXCHANGE_INVALID_INVOCATION: 'Exchange: Invalid invocation',
    EXCHANGE_INVALID_FEE_PERCENT: 'Exchange: invalid fee percent',
    EXCHANGE_INVALID_PRICE: 'Exchange: invalid price',
    EXCHANGE_MAINTENANCE_MODE: 'Exchange: maintenance mode',
    EXCHANGE_TOO_HIGH_PRICE: 'Exchange: too high price',
    EXCHANGE_TOO_LOW_PRICE: 'Exchange: too low price',
    EXCHANGE_INSUFFICIENT_BALANCE: 'Exchange: insufficient balance',
    EXCHANGE_INSUFFICIENT_ETHER_SUPPLY: 'Exchange: insufficient ether supply',
    EXCHANGE_PAYMENT_FAILED: 'Exchange: payment failed',
    EXCHANGE_TRANSFER_FAILED: 'Exchange: transfer failed',
    EXCHANGE_FEE_TRANSFER_FAILED: 'Exchange: fee transfer failed',

    EXCHANGE_STOCK_NOT_FOUND: 'Exchange: stock not found',
    EXCHANGE_STOCK_INVALID_PARAMETER: 'Exchange: stock invalid parameter',
    EXCHANGE_STOCK_INVALID_INVOCATION: 'Exchange: stock invalid invocation',
    EXCHANGE_STOCK_ADD_CONTRACT: 'Exchange: stock add contract',
    EXCHANGE_STOCK_UNABLE_CREATE_EXCHANGE: 'Exchange: stock unable to create exchange',

    VOTE_INVALID_PARAMETER: 'Vote: invalid parameter',
    VOTE_INVALID_INVOCATION: 'Vote: invalid invocation',
    VOTE_ADD_CONTRACT: 'Vote: add contract',
    VOTE_LIMIT_EXCEEDED: 'Vote: limit exceeded',
    VOTE_POLL_LIMIT_REACHED: 'Vote: poll limit reached',
    VOTE_POLL_WRONG_STATUS: 'Vote: poll wrong status',
    VOTE_POLL_INACTIVE: 'Vote: poll inactive',
    VOTE_POLL_NO_SHARES: 'Vote: poll has\'t shares',
    VOTE_POLL_ALREADY_VOTED: 'Vote: poll already voted',
    VOTE_ACTIVE_POLL_LIMIT_REACHED: 'Vote: active poll limit reached',
    VOTE_UNABLE_TO_ACTIVATE_POLL: 'Vote: unable to activate poll',

    REWARD_NOT_FOUND: 'Reward: not found',
    REWARD_INVALID_PARAMETER: 'Reward: invalid request parameter',
    REWARD_INVALID_INVOCATION: 'Reward: invalid invocation',
    REWARD_INVALID_STATE: 'Reward: invalid state',
    REWARD_INVALID_PERIOD: 'Reward: invalid period',
    REWARD_NO_REWARDS_LEFT: 'Reward: no rewards left',
    REWARD_ASSET_TRANSFER_FAILED: 'Reward: asset transfer failed',
    REWARD_ALREADY_CALCULATED: 'Reward: already calculated',
    REWARD_CALCULATION_FAILED: 'Reward: calculation failed',
    REWARD_CANNOT_CLOSE_PERIOD: 'Reward: cannot close period',
    REWARD_ASSET_ALREADY_REGISTERED: 'Reward: asset already registered',

    CONTRACT_EXISTS: 'Contract already exists',
    CONTRACT_NOT_EXISTS: 'Contract not exists',

    TIMEHOLDER_ALREADY_ADDED: 'Timeholder already added',
    TIMEHOLDER_INVALID_INVOCATION: 'Timeholder: invalid invocation',
    TIMEHOLDER_INVALID_STATE: 'Timeholder: invalid state',
    TIMEHOLDER_TRANSFER_FAILED: 'Timeholder: transfer failed',
    TIMEHOLDER_WITHDRAWN_FAILED: 'Timeholder: withdrawn failed',
    TIMEHOLDER_DEPOSIT_FAILED: 'Timeholder: deposit failed',
    TIMEHOLDER_INSUFFICIENT_BALANCE: 'Timeholder: insufficient balance',

    ERCMANAGER_INVALID_INVOCATION: 'ERC20 Manager: invalid invocation',
    ERCMANAGER_INVALID_STATE: 'ERC20 Manager: invalid state',
    ERCMANAGER_TOKEN_SYMBOL_NOT_EXISTS: 'ERC20 Manager: token symbol not exists',
    ERCMANAGER_TOKEN_NOT_EXISTS: 'ERC20 Manager: token not exists',
    ERCMANAGER_TOKEN_SYMBOL_ALREADY_EXISTS: 'ERC20 Manager: token symbol already exists',
    ERCMANAGER_TOKEN_ALREADY_EXISTS: 'ERC20 Manager: token already exists',
    ERCMANAGER_TOKEN_UNCHANGED: 'ERC20 Manager: token unchanged',

    ASSETS_INVALID_INVOCATION: 'Assets: invalid invocation',
    ASSETS_EXISTS: 'Asset already exists',
    ASSETS_TOKEN_EXISTS: 'Assets: token already exists',
    ASSETS_CANNON_CLAIM_PLATFORM_OWNERSHIP: 'Assets: cannot claim platform ownership',
    ASSETS_WRONG_PLATFORM: 'Assets: wrong platform',
    ASSETS_NOT_A_PROXY: 'Assets: not a proxy',
    ASSETS_OWNER_ONLY: 'Assets: owner only',
    ASSETS_CANNOT_ADD_TO_REGISTRY: 'Assets: cannot add to registry',
  }
}
