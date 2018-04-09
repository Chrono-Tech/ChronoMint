/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const prefix = 'SendTokens'

export default {
  en: {
    fast: 'Fast',
    slow: 'Slow',
    balance: 'Balance',
    recipientAddress: 'Recipient address',
    amount: 'Amount',
    feeRate: 'Fee: %{multiplier} of average (%{total} sat/byte)',
    gasPrice: 'Gas Price: %{multiplier} of average (%{total} Gwei)',
    approve: 'Approve',
    revoke: 'Revoke',
    allowance: 'Allowance',
    send: 'Send',
    timeLockedWarn: 'You select Time-locked wallet. Outgoing transfers locked until',
  },
  ru: {
    fast: 'Быстро',
    slow: 'Медленно',
    balance: 'Баланс',
    recipientAddress: 'Адрес получателя',
    amount: 'Сумма',
    feeRate: 'Комиссия: %{multiplier} от средней (%{total} sat/byte)',
    gasPrice: 'Цена газа: %{multiplier} of среднего (%{total} Gwei)',
    approve: 'Подтвердить',
    revoke: 'Отозвать',
    allowance: 'allowance',
    send: 'Отправить',
    timeLockedWarn: 'Вы выбрали Time-locked кошелек. Исходящие транзакции запрещены до',
  },
}
