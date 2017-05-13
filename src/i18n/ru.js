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
    remove: 'Удалить',
    error: 'Ошибка'
  },
  operations: {
    pending: 'В ожидании',
    completed: 'Завершенные',
    desc: 'Описание',
    signs: 'Осталось подписать',
    sign: 'Подписать',
    revoke: 'Отозвать',
    emptyPendingList: 'Нет операций, ожидающих подписей.',
    errors: {
      duplicate: 'Эта транзакция уже добавлена в список операций, требующих мультиподпись.'
    }
  },
  tx: {
    UserManager: {
      addCBE: {
        title: 'Добавить CBE',
        name: 'Имя',
        address: 'Адрес'
      },
      revokeCBE: {
        title: 'Отозвать CBE',
        name: 'Имя',
        address: 'Адрес'
      },
      setRequired: {
        title: 'Установить Требуемые Подписи',
        _required: 'Количество'
      }
    },
    ContractsManager: {
      setOtherAddress: {
        title: 'Добавить Контракт',
        value: 'Адрес'
      },
      setAddress: {
        title: 'Добавить Токен',
        value: 'Адрес'
      }
    }
  }
}
