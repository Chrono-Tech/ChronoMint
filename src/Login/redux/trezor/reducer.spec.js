import * as a from './actions'
import reducer from './reducer'

describe('trezor reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isHttps: false,
      isU2F: false,
      isETHAppOpened: false,
      isFetching: false,
      isFetched: false,
    })
  })

  it('should handle TREZOR_SET_U2F', () => {
    expect(reducer({}, { type: a.TREZOR_SET_U2F, isU2F: true }))
      .toEqual({
        isU2F: true,
      })
  })

  it('should handle TREZOR_SET_ETH_APP_OPENED', () => {
    expect(reducer({}, { type: a.TREZOR_SET_ETH_APP_OPENED, isETHAppOpened: true }))
      .toEqual({
        isETHAppOpened: true,
      })
  })

  it('should handle TREZOR_FETCHING', () => {
    expect(reducer({}, { type: a.TREZOR_FETCHING }))
      .toEqual({
        isFetching: true,
      })
  })

  it('should handle TREZOR_FETCHED', () => {
    expect(reducer({ isFetching: true }, { type: a.TREZOR_FETCHED, isFetched: true }))
      .toEqual({
        isFetched: true,
        isFetching: false,
      })
  })
})
