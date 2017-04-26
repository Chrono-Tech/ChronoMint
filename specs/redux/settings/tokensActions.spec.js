import {Map} from 'immutable'
import * as modal from '../../../src/redux/ui/modal'
import * as notifier from '../../../src/redux/notifier/notifier'
import * as a from '../../../src/redux/settings/tokens'
import { address as validateAddress } from '../../../src/components/forms/validate'
import TokenContractsDAO from '../../../src/dao/TokenContractsDAO'
import TokenContractModel from '../../../src/models/contracts/TokenContractModel'
import {store} from '../../init'
import web3Provider from '../../../src/network/Web3Provider'

let accounts
let token = null
/** @see TokenContractModel */
let token2 = null
let holder = null
let balance = null

describe('settings tokens actions', () => {
  beforeAll(done => {
    web3Provider.getWeb3().then(web3 => {
      accounts = web3.eth.accounts
      done()
    })
  })

  it('should list tokens', () => {
    return store.dispatch(a.listTokens()).then(() => {
      const list = store.getActions()[2].list
      expect(list instanceof Map).toBeTruthy()

      const address = list.keySeq().toArray()[0]
      token = list.get(address)
      token2 = list.get(list.keySeq().toArray()[1])
      expect(token.address()).toEqual(address)
      expect(validateAddress(token.address())).toEqual(null)
    })
  })

  it('should list balances', () => {
    return store.dispatch(a.listTokenBalances(token)).then(() => {
      expect(store.getActions()[0]).toEqual({
        type: a.TOKENS_BALANCES,
        balances: new Map({'Loading...': null})
      })

      const num = store.getActions()[1]
      expect(num).toEqual({
        type: a.TOKENS_BALANCES_NUM,
        num: num.num,
        pages: num.pages
      })

      const list = store.getActions()[2]
      const balances = list.balances
      expect(list).toEqual({
        type: a.TOKENS_BALANCES,
        balances
      })

      expect(balances.size).toBeLessThanOrEqual(num.num)
      expect(balances.size).toBeLessThanOrEqual(100)
      expect(num.pages).toEqual(Math.ceil(num.num / 100))

      holder = balances.keySeq().toArray()[0]
      balance = balances.get(holder)
    })
  })

  it('should list balances with address filter', () => {
    return store.dispatch(a.listTokenBalances(token, 0, holder)).then(() => {
      expect(store.getActions()[1]).toEqual({
        type: a.TOKENS_BALANCES_NUM, num: 1, pages: 1
      })

      let expected = new Map()
      expected = expected.set(holder, balance)
      expect(store.getActions()[2]).toEqual({
        type: a.TOKENS_BALANCES,
        balances: expected
      })
    })
  })

  it('should not list balances with invalid address filter', () => {
    return store.dispatch(a.listTokenBalances(token, 0, '0xinvalid')).then(() => {
      expect(store.getActions()[1]).toEqual({
        type: a.TOKENS_BALANCES_NUM, num: 0, pages: 0
      })
      expect(store.getActions()[2]).toEqual({
        type: a.TOKENS_BALANCES,
        balances: new Map()
      })
    })
  })

  it('should open view token modal', () => {
    return store.dispatch(a.viewToken(token)).then(() => {
      const view = store.getActions()[2]
      expect(view).toEqual({
        type: a.TOKENS_VIEW,
        token: view.token
      })
      expect(view.token.address()).toEqual(token.address())
      expect(view.token.name().length).toBeGreaterThan(0)
      expect(view.token.totalSupply()).toBeGreaterThanOrEqual(0)

      expect(store.getActions()[3]).toEqual({
        type: modal.MODAL_SHOW,
        payload: {modalType: modal.SETTINGS_TOKEN_VIEW_TYPE, modalProps: undefined}
      })
    })
  })

  it('should show token form', () => {
    store.dispatch(a.formToken(token))

    const view = store.getActions()[0]
    expect(view).toEqual({type: a.TOKENS_FORM, token})

    expect(store.getActions()[1]).toEqual({
      type: modal.MODAL_SHOW,
      payload: {modalType: modal.SETTINGS_TOKEN_TYPE, modalProps: undefined}
    })
  })

  it('should remove token', () => {
    return new Promise(resolve => {
      TokenContractsDAO.watch((revokedToken, ts, isRevoked, isOld) => {
        if (!isOld && isRevoked && revokedToken.address() === token2.address()) {
          expect(revokedToken).toEqual(token2)
          resolve()
        }
      }, accounts[0])

      store.dispatch(a.revokeToken(token2, accounts[0])).then(() => {
        expect(store.getActions()).toEqual([
          {type: a.TOKENS_UPDATE, token: token2.fetching()},
          {type: a.TOKENS_REMOVE_TOGGLE, token: null}
        ])
      })
    })
  })

  it('should modify token', () => {
    return new Promise(resolve => {
      TokenContractsDAO.watch((updatedToken, ts, isRevoked) => {
        if (!isRevoked && updatedToken.address() === token2.address()) {
          expect(updatedToken).toEqual(token2)
          resolve()
        }
      }, accounts[0])

      store.dispatch(a.treatToken(token, token2.address(), accounts[0])).then(() => {
        expect(store.getActions()).toEqual([
          {type: a.TOKENS_UPDATE, token: new TokenContractModel({address: token2.address(), isFetching: true})},
          {type: a.TOKENS_REMOVE, token}
        ])
      })
    })
  })

  it('should add token', () => {
    return new Promise(resolve => {
      TokenContractsDAO.watch((addedToken, ts, isRevoked) => {
        if (!isRevoked && addedToken.address() === token.address()) {
          expect(addedToken).toEqual(token)
          resolve()
        }
      }, accounts[0])

      store.dispatch(a.treatToken(new TokenContractModel(), token.address(), accounts[0])).then(() => {
        expect(store.getActions()).toEqual([
          {type: a.TOKENS_UPDATE, token: new TokenContractModel({address: token.address(), isFetching: true})}
        ])
      })
    })
  })

  it('should not modify token address on already added token address', () => {
    return store.dispatch(a.treatToken(token, token2.address(), accounts[0])).then(() => {
      const newToken = new TokenContractModel({address: token2.address()})
      expect(store.getActions()).toEqual([
        {type: a.TOKENS_UPDATE, token: newToken.fetching()},
        {type: a.TOKENS_REMOVE, token: token},
        {type: a.TOKENS_ERROR, address: newToken.address()},
        {type: a.TOKENS_REMOVE, token: newToken},
        {type: a.TOKENS_UPDATE, token: token}
      ])
    })
  })

  it('should create a notice and dispatch token when updated', () => {
    store.dispatch(a.watchToken(token, null, false, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
      {type: notifier.NOTIFIER_LIST, list: store.getActions()[1].list},
      {type: a.TOKENS_UPDATE, token}
    ])

    const notice = store.getActions()[0].notice
    expect(notice.token()).toEqual(token)
    expect(notice.isRevoked()).toBeFalsy()
    expect(store.getActions()[1].list.get(notice.id())).toEqual(notice)
  })

  it('should create a notice and dispatch token when revoked', () => {
    store.dispatch(a.watchToken(token, null, true, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
      {type: notifier.NOTIFIER_LIST, list: store.getActions()[1].list},
      {type: a.TOKENS_REMOVE, token}
    ])

    const notice = store.getActions()[0].notice
    expect(notice.token()).toEqual(token)
    expect(notice.isRevoked()).toBeTruthy()
    expect(store.getActions()[1].list.get(notice.id())).toEqual(notice)
  })

  it('should create an action to show an error', () => {
    expect(a.showTokenError(token.address())).toEqual({type: a.TOKENS_ERROR, address: token.address()})
  })

  it('should create an action to hide an error', () => {
    expect(a.hideTokenError()).toEqual({type: a.TOKENS_HIDE_ERROR})
  })

  it('should create an action to toggle remove token dialog', () => {
    expect(a.removeTokenToggle(token)).toEqual({type: a.TOKENS_REMOVE_TOGGLE, token})
  })

  it('should create an action to update token balances num', () => {
    expect(a.tokenBalancesNum(100, 1)).toEqual({type: a.TOKENS_BALANCES_NUM, num: 100, pages: 1})
  })

  it('should create an action to flag fetch start', () => {
    expect(a.fetchTokensStart()).toEqual({type: a.TOKENS_FETCH_START})
  })

  it('should create an action to flag fetch end', () => {
    expect(a.fetchTokensEnd()).toEqual({type: a.TOKENS_FETCH_END})
  })
})
