export default {
  approval: {
    title: 'Подтверждение',
    message: 'Сумма %{value} %{symbol} подтверждена для перевода с контракта %{contractName}',
    details: {
      contractName: 'Название контракта',
      value: 'Сумма',
    },
  },
  arbitrary: {
    title: 'Сообщение',
  },
  error: {
    title: 'Ошибка',
  },
  cbe: {
    added: 'CBE %{address} добавлен',
    removed: 'CBE %{address} удалён',
  },
  locs: {
    added: 'LOC \'%{name}\' добавлен',
    removed: 'LOC \'%{name}\' удалён',
    updated: 'LOC \'%{name}\' изменён',
    statusUpdated: 'LOC \'%{name}\' статус изменён',
    issued: 'LOC \'%{name}\' запрощен',
    revoked: 'LOC \'%{name}\' отозван',
    failed: 'LOC \'%{name}\' failed',
    details: {
      amount: 'Количество',
    },
  },
  polls: {
    title: 'Голосования',
    isCreated: 'Голосование создано',
    isActivated: 'Голосование активировано',
    isEnded: 'Голосование завершено',
    isUpdated: 'Голосование обновлено',
    isRemoved: 'Голосование удалено',
    isVoted: 'Голос принят',
  },
  transfer: {
    title: 'Перевод',
    receivedFrom: '%{value} %{symbol} получено с адреса %{address}',
    sentTo: '%{value} %{symbol} отправлено на адрес %{address}',
    errors: {
      TRANSFER_CANCELLED: 'Отменено пользователем из диалога подтверждения транзакции',
      TRANSFER_UNKNOWN: 'Неизвестная ошибка транзакции',
    },
  },
  profile: {
    copyIcon: 'Ваш адрес был скопирован.',
    pkIcon: 'Ваш приватный ключ был скопирован.',
    changed: 'Профиль был успешно изменен',
  },
  operations: {
    title: 'Ожидающие Операции',
    confirmed: 'Операция подтверждена, осталось подписей: %{remained}',
    cancelled: 'Операция отменена',
    revoked: 'Операция отозвана, осталось подписей: %{remained}',
    done: 'Операция завершена',
    details: {
      hash: 'Хэш',
      operation: 'Операция',
    },
  },
  settings: {
    title: 'Настройки',
    erc20: {
      tokens: {
        isAdded: 'Токен "%{symbol} – %{name}" был добавлен.',
        isModified: 'Токен "%{symbol} – %{name}" был изменён.',
        isRemoved: 'Токен "%{symbol} – %{name}" был удалён.',
      },
    },
  },
  wallet: {
    title: 'Мульти-кошелек',
    create: '%{address}: создан',
  },
  assetsManager: {
    title: 'Ассет менеджер',
    managerAdded: 'Менеджер добавлен',
    managerRemoved: 'Менеджер удален',
  },
}
