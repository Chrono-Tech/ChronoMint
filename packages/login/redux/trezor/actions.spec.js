import { store } from 'specsInit'
import trezorProvider from '../../network/TrezorProvider'
import * as a from './actions'

describe('Trezor action', () => {
  beforeEach(() => {
    window.u2f = {}
  })

  it.skip('should try to init trezor', async () => {
    const isInited = await store.dispatch(a.initTrezor())
    expect(store.getActions()).toEqual([
      { type: a.TREZOR_SET_U2F, isU2F: true },
      { type: a.TREZOR_SET_ETH_APP_OPENED, isETHAppOpened: false },
    ])
    expect(isInited).toEqual(true)
  })

  it.skip('should try to sync and handle connection update', async () => {
    // TODO @dkchv: mock trezor
    const isSync = await store.dispatch(a.startTrezorSync())

    expect(isSync).toEqual(false)

    trezorProvider.emit('connection', true)
    expect(store.getActions()).toEqual([
      { type: a.TREZOR_SET_ETH_APP_OPENED, isETHAppOpened: true },
    ])
    store.clearActions()

    trezorProvider.emit('connection', true)
    expect(store.getActions()).toEqual([
      { type: a.TREZOR_SET_ETH_APP_OPENED, isETHAppOpened: false },
    ])
  })
})
