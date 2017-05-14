import * as user from '../dao/UserDAO'
import * as tokens from '../dao/TokenContractsDAO'
import * as contracts from '../dao/OtherContractsDAO'
import * as vote from '../dao/VoteDAO'

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
    save: 'Сохранить',
    cancel: 'Отменить',
    view: 'Просмотр',
    remove: 'Удалить',
    error: 'Ошибка'
  },
  operations: {
    pending: 'В ожидании',
    completed: 'Завершенные',
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
  tx: {
    UserManager: {
      [user.FUNC_ADD_CBE]: {
        title: 'Добавить CBE',
        name: 'Имя',
        address: 'Адрес'
      },
      [user.FUNC_REVOKE_CBE]: {
        title: 'Отозвать CBE',
        name: 'Имя',
        address: 'Адрес'
      },
      [user.FUNC_SET_REQUIRED_SIGNS]: {
        title: 'Мультиподпись',
        _required: 'Кол-во'
      }
    },
    ContractsManager: {
      // token contracts
      [tokens.FUNC_SET_ADDRESS]: {
        title: 'Добавить Токен',
        value: 'Адрес'
      },
      [tokens.FUNC_CHANGE_ADDRESS]: {
        title: 'Изменить Токен',
        _from: 'С',
        _to: 'На'
      },
      [tokens.FUNC_REMOVE_ADDRESS]: {
        title: 'Удалить Токен',
        value: 'Адрес'
      },

      // assets
      [tokens.FUNC_REVOKE_ASSET]: {
        title: 'Отозвать Актив',
        symbol: 'Токен',
        value: 'Объем',
        loc: 'LOC'
      },
      [tokens.FUNC_REISSUE_ASSET]: {
        title: 'Перевыпустить Актив',
        symbol: 'Токен',
        value: 'Объем',
        loc: 'LOC'
      },

      // common
      [tokens.FUNC_CLAIM_CONTRACT_OWNERSHIP]: {
        title: 'Заявка на Владение Контрактом',
        address: 'Адрес'
      },

      // other contracts
      [contracts.FUNC_SET_OTHER_ADDRESS]: {
        title: 'Добавить Контракт',
        value: 'Адрес'
      },
      [contracts.FUNC_REMOVE_OTHER_ADDRESS]: {
        title: 'Удалить Контракт',
        value: 'Адрес'
      }
    },
    Vote: {
      [vote.FUNC_ADMIN_END_POLL]: {
        title: 'Окончить Опрос',
        id: 'Id'
      },
      [vote.FUNC_ACTIVATE_POLL]: {
        title: 'Активировать Опрос',
        id: 'Id'
      }
    }
  }
}
