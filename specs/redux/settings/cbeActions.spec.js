import { Map } from 'immutable'
import * as modal from '../../../src/redux/ui/modal'
import * as notifier from '../../../src/redux/notifier/notifier'
import * as a from '../../../src/redux/settings/cbe'
import { address as validateAddress } from '../../../src/components/forms/validate'
import UserManagerDAO from '../../../src/dao/UserManagerDAO'
import CBEModel from '../../../src/models/CBEModel'
import CBENoticeModel from '../../../src/models/notices/CBENoticeModel'
import UserModel from '../../../src/models/UserModel'
import { store } from '../../init'
import { FORM_SETTINGS_CBE } from '../../../src/components/forms/settings/CBEAddressForm'
import web3Provider from '../../../src/network/Web3Provider'

let accounts, user, cbe

describe('settings cbe actions', () => {
  beforeAll(done => {
    web3Provider.getWeb3().then(web3 => {
      accounts = web3.eth.accounts
      user = new UserModel({name: Math.random().toString()})
      cbe = new CBEModel({address: accounts[1], name: user.name(), user})
      done()
    })
  })

  it('should list CBEs', () => {
    return store.dispatch(a.listCBE()).then(() => {
      const list = store.getActions()[1].list
      expect(list instanceof Map).toBeTruthy()

      const address = list.keySeq().toArray()[0]
      expect(validateAddress(address)).toEqual(null)
      expect(list.get(address).address()).toEqual(accounts[0])
    })
  })

  it('should treat CBE', () => {
    return new Promise(resolve => {
      UserManagerDAO.watchCBE((notice, isOld) => {
        if (!isOld && !notice.isRevoked()) {
          expect(notice.cbe()).toEqual(cbe)
          resolve()
        }
      }, accounts[0])

      store.dispatch(a.treatCBE(cbe, true)).then(() => {
        expect(store.getActions()).toEqual([
          notifier.transactionStart(),
          {type: a.CBE_UPDATE, cbe: cbe.fetching()}
        ])
      })
    })
  })

  it('should show CBE form', () => {
    store.dispatch(a.formCBE(cbe))
    expect(store.getActions()).toEqual([
      {type: a.CBE_FORM, cbe},
      {type: modal.MODAL_SHOW, payload: {modalType: modal.SETTINGS_CBE_TYPE, modalProps: undefined}}
    ])
  })

  it('should show load name to CBE form', () => {
    return store.dispatch(a.formCBELoadName(cbe.address())).then(() => {
      expect(store.getActions()).toEqual([{
        'meta': {
          'field': 'name',
          'form': FORM_SETTINGS_CBE,
          'persistentSubmitErrors': undefined,
          'touch': undefined
        },
        'payload': 'loading...',
        'type': '@@redux-form/CHANGE'
      }, {
        'meta': {
          'field': 'name',
          'form': FORM_SETTINGS_CBE,
          'persistentSubmitErrors': undefined,
          'touch': undefined
        },
        'payload': cbe.name(),
        'type': '@@redux-form/CHANGE'
      }])
    })
  })

  it('should revoke CBE', () => {
    return new Promise(resolve => {
      UserManagerDAO.watchCBE((notice) => {
        if (notice.isRevoked()) {
          expect(notice.cbe()).toEqual(cbe)
          resolve()
        }
      }, accounts[0])

      store.dispatch(a.revokeCBE(cbe)).then(() => {
        expect(store.getActions()).toEqual([
          {type: a.CBE_REMOVE_TOGGLE, cbe: null},
          notifier.transactionStart(),
          {type: a.CBE_UPDATE, cbe: cbe.fetching()}
        ])
      })
    })
  })

  it('should create a notice and dispatch CBE when updated', () => {
    const notice = new CBENoticeModel({cbe, isRevoked: false})
    store.dispatch(a.watchCBE(notice, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
      {type: notifier.NOTIFIER_LIST, list: store.getActions()[1].list},
      {type: a.CBE_UPDATE, cbe}
    ])
    expect(store.getActions()[0].notice).toEqual(notice)
    expect(store.getActions()[1].list.get(notice.id())).toEqual(notice)
  })

  it('should create a notice and dispatch CBE when revoked', () => {
    const notice = new CBENoticeModel({cbe, isRevoked: true})
    store.dispatch(a.watchCBE(notice, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
      {type: notifier.NOTIFIER_LIST, list: store.getActions()[1].list},
      {type: a.CBE_REMOVE, cbe}
    ])
    expect(store.getActions()[0].notice).toEqual(notice)
    expect(store.getActions()[1].list.get(notice.id())).toEqual(notice)
  })

  it('should create an action to update cbe', () => {
    expect(a.updateCBE(cbe)).toEqual({type: a.CBE_UPDATE, cbe})
  })

  it('should create an action to remove cbe', () => {
    expect(a.removeCBE(cbe)).toEqual({type: a.CBE_REMOVE, cbe})
  })

  it('should create an action to toggle remove cbe dialog', () => {
    expect(a.removeCBEToggle(cbe)).toEqual({type: a.CBE_REMOVE_TOGGLE, cbe})
  })
})
