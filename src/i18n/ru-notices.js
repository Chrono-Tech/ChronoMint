export default {
  approval: {
    title: 'Подтверждение',
    message: 'Сумма %{value} %{symbol} подтверждана для перевода с %{contractName}',
    details: {
      contractName: 'Название контракта',
      value: 'Сумма'
    }
  },
  arbitrary: {
    title: 'Сообщение'
  },
  cbe: {
    added: 'CBE %{address} добавлен',
    removed: 'CBE %{address} удалён'
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
      amount: 'Количество'
    }
  },
  transfer: {
    title: 'Перевод',
    recievedFrom: '%{value} %{symbol} получено с адреса %{address}',
    sentTo: '%{value} %{symbol} отправлено на адрес %{address}'
  },
  profile: {
    copyIcon: 'Ваш адрес был скопирован.'
  },
  tx: {
    processing: 'Транзакция выполняется...'
  },
  operations: {
    confirmed: 'Операция подтверждена, осталось подписей: %{remained}',
    cancelled: 'Операция отменена',
    revoked: 'Операция отозвана, осталось подписей: %{remained}',
    done: 'Operation complete',
    details: {
      hash: 'Hash',
      operation: 'Операция'
    }
  },
  settings: {
    erc20: {
      tokens: {
        isAdded: 'Токен "%{symbol} – %{name}" был добавлен.',
        isModified: 'Токен "%{symbol} – %{name}" был изменён.',
        isRemoved: 'Токен "%{symbol} – %{name}" был удалён.'
      }
    }
  }
}
