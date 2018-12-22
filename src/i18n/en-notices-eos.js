/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export default {
  AmountEvent: {
    title: 'Amount',
    message: 'Claim amount has been increased to %{amount} %{symbol}',
  },
  PaidEvent: {
    title: 'Paid',
    message: 'Claim has been paid, start to create EOS account',
  },
  CreatedEvent: {
    title: 'Created',
    message: 'Account %{account} created',
  },
  NotCreatedEvent: {
    title: 'Not created',
    message: 'Account not created, try again',
  },
  TimeoutEvent: {
    title: 'Closed',
    message: 'Claim has been closed by timeout',
  },
}
