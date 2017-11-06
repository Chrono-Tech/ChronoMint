import { store } from 'specsInit'
import ledgerProvider from 'network/LedgerProvider'
import * as a from './actions'

describe('Ledger action', () => {
  beforeEach(() => {
    window.u2f = {}
  })

  it('should try to init ledger', async () => {
    const isInited = await store.dispatch(a.initLedger())
    expect(store.getActions()).toEqual([
      { type: a.LEDGER_SET_U2F, isU2F: true },
      { type: a.LEDGER_SET_ETH_APP_OPENED, isETHAppOpened: false },
    ])
    expect(isInited).toEqual(true)
  })

  it.skip('should try to sync and handle connection update', async () => {
    // TODO @dkchv: mock ledger
    const isSync = await store.dispatch(a.startLedgerSync())

    expect(isSync).toEqual(false)

    ledgerProvider.emit('connection', true)
    expect(store.getActions()).toEqual([
      { type: a.LEDGER_SET_ETH_APP_OPENED, isETHAppOpened: true },
    ])
    store.clearActions()

    ledgerProvider.emit('connection', true)
    expect(store.getActions()).toEqual([
      { type: a.LEDGER_SET_ETH_APP_OPENED, isETHAppOpened: false },
    ])
  })
})
