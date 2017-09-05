import * as a from './actions'
import { store } from 'specsInit'
import ledgerProvider from 'network/LedgerProvider'

describe('Ledger action', () => {
  it('should init ledger', async () => {
    const isInited = await store.dispatch(a.initLedger())
    expect(store.getActions()).toEqual([
      {type: a.LEDGER_SET_U2F, isU2f: false},
      {type: a.LEDGER_SET_ETH_APP_OPENED, isETHAppOpened: false}
    ])
    expect(isInited).toEqual(true)
  })

  it('should start sync with Ledger and handle connection update', async () => {
    await store.dispatch(a.startLedgerSync())
    ledgerProvider.emit('connection', true)
    expect(store.getActions()).toEqual([
      {type: a.LEDGER_SET_ETH_APP_OPENED, isETHAppOpened: true}
    ])
    store.clearActions()

    ledgerProvider.emit('connection', true)
    expect(store.getActions()).toEqual([
      {type: a.LEDGER_SET_ETH_APP_OPENED, isETHAppOpened: false}
    ])
  })
})
