import {Map} from 'immutable'
import * as a from '../../../src/redux/settings/otherContracts'
import * as modal from '../../../src/redux/ui/modal'
import * as notifier from '../../../src/redux/notifier/notifier'
import isEthAddress from '../../../src/utils/isEthAddress'
import OtherContractsDAO from '../../../src/dao/OtherContractsDAO'
import ExchangeContractModel from '../../../src/models/contracts/ExchangeContractModel'
import {store} from '../../init'

const accounts = OtherContractsDAO.getAccounts()
let contract = null
/** @see ExchangeContractModel */
let contractWithSettings = null

describe('settings other contracts actions', () => {
  it('should list contracts', () => {
    return store.dispatch(a.listContracts()).then(() => {
      const list = store.getActions()[2].list
      expect(list instanceof Map).toBeTruthy()

      const address = list.keySeq().toArray()[0]
      contract = list.get(address)
      expect(contract.address()).toEqual(address)
      expect(isEthAddress(contract.address())).toBeTruthy()

      if (!(contract instanceof ExchangeContractModel)) {
        contract = list.get(list.keySeq().toArray()[1])
      }
      expect(contract.name()).toEqual('Exchange')
    })
  })

  it('should show contract form', () => {
    store.dispatch(a.formContract(contract))

    const view = store.getActions()[0]
    expect(view).toEqual({type: a.OTHER_CONTRACTS_FORM, contract})

    expect(store.getActions()[1]).toEqual({
      type: modal.MODAL_SHOW,
      payload: {modalType: modal.SETTINGS_OTHER_CONTRACT_TYPE, modalProps: undefined}
    })
  })

  it('should update Exchange contract settings', () => {
    contractWithSettings = contract.set('settings', {
      buyPrice: Math.round(Math.random() * 400) + 100,
      sellPrice: Math.round(Math.random() * 400) + 600
    })
    return store.dispatch(a.saveContractSettings(contractWithSettings, accounts[0])).then(() => {
      expect(store.getActions()).toEqual([
        {type: a.OTHER_CONTRACTS_FETCH_START},
        {type: a.OTHER_CONTRACTS_FETCH_END}
      ])
    })
  })

  it('should show contract modify form with updated settings', () => {
    return store.dispatch(a.formModifyContract(contract)).then(() => {
      let view = store.getActions()[2]
      expect(view.contract.settings()).toEqual(contractWithSettings.settings())
      expect(store.getActions()[3]).toEqual({
        type: modal.MODAL_SHOW,
        payload: {modalType: modal.SETTINGS_OTHER_CONTRACT_MODIFY_TYPE, modalProps: undefined}
      })
    })
  })

  it('should remove contract', () => {
    return new Promise(resolve => {
      OtherContractsDAO.watch((revokedContract, ts, isRevoked, isOld) => {
        if (!isOld && isRevoked) {
          expect(revokedContract).toEqual(contract)
          resolve()
        }
      }, accounts[0])

      store.dispatch(a.revokeContract(contract, accounts[0])).then(() => {
        expect(store.getActions()).toEqual([
          {type: a.OTHER_CONTRACTS_FETCH_START},
          {type: a.OTHER_CONTRACTS_REMOVE_TOGGLE, contract: null},
          {type: a.OTHER_CONTRACTS_FETCH_END}
        ])
      })
    })
  })

  it('should add contract', () => {
    return new Promise(resolve => {
      OtherContractsDAO.watch((addedContract, ts, isRevoked) => {
        if (!isRevoked) {
          expect(addedContract).toEqual(contract)
          resolve()
        }
      }, accounts[0])

      store.dispatch(a.addContract(contract.address(), accounts[0])).then(() => {
        expect(store.getActions()).toEqual([
          {type: a.OTHER_CONTRACTS_FETCH_START},
          {type: a.OTHER_CONTRACTS_FETCH_END}
        ])
      })
    })
  })

  it('should create a notice and dispatch contract when updated', () => {
    store.dispatch(a.watchContract(contract, null, false, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
      {type: notifier.NOTIFIER_LIST, list: store.getActions()[1].list},
      {type: a.OTHER_CONTRACTS_UPDATE, contract}
    ])

    const notice = store.getActions()[0].notice
    expect(notice.contract()).toEqual(contract)
    expect(notice.isRevoked()).toBeFalsy()
    expect(store.getActions()[1].list.get(0)).toEqual(notice)
  })

  it('should create a notice and dispatch contract when updated', () => {
    store.dispatch(a.watchContract(contract, null, true, false))
    expect(store.getActions()).toEqual([
      {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
      {type: notifier.NOTIFIER_LIST, list: store.getActions()[1].list},
      {type: a.OTHER_CONTRACTS_REMOVE, contract}
    ])

    const notice = store.getActions()[0].notice
    expect(notice.contract()).toEqual(contract)
    expect(notice.isRevoked()).toBeTruthy()
    expect(store.getActions()[1].list.get(0)).toEqual(notice)
  })

  it('should create an action to show contract form', () => {
    expect(a.showContractForm(contract)).toEqual({type: a.OTHER_CONTRACTS_FORM, contract})
  })

  it('should create an action to show an error', () => {
    expect(a.showContractError(contract.address()))
      .toEqual({type: a.OTHER_CONTRACTS_ERROR, address: contract.address()})
  })

  it('should create an action to hide an error', () => {
    expect(a.hideContractError()).toEqual({type: a.OTHER_CONTRACTS_HIDE_ERROR})
  })

  it('should create an action to toggle remove contract dialog', () => {
    expect(a.removeContractToggle(contract)).toEqual({type: a.OTHER_CONTRACTS_REMOVE_TOGGLE, contract})
  })

  it('should create an action to flag fetch start', () => {
    expect(a.fetchContractsStart()).toEqual({type: a.OTHER_CONTRACTS_FETCH_START})
  })

  it('should create an action to flag fetch end', () => {
    expect(a.fetchContractsEnd()).toEqual({type: a.OTHER_CONTRACTS_FETCH_END})
  })
})
