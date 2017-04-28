// import * as actions from '../../../src/redux/locs/list/actions'
import * as formActions from '../../../src/redux/locs/locForm/actions'
// import { LOCS_LIST, LOC_CREATE, LOC_UPDATE, LOC_REMOVE } from '../../../src/redux/locs/list/reducer'
// import {LOCS_FETCH_START, LOCS_FETCH_END} from '../../../src/redux/locs/commonProps/'
// import {LOCS_COUNTER} from '../../../src/redux/locs/counter'
// import LOCsManagerDAO from '../../../src/dao/LOCsManagerDAO'
import { store } from '../../init'
// import { address as validateAddress } from '../../../src/components/forms/validate'
import LOCModel from '../../../src/models/LOCModel'
// import web3Provider from '../../../src/network/Web3Provider'

// const account = web3Provider.getWeb3instance().eth.accounts[0]
// let address

describe('LOCs actions', () => {
  // it('should propose new LOC', done => {
  //   const loc = new LOCModel({
  //     locName: '1484554656',
  //     website: 'www.ru',
  //     issueLimit: 1000,
  //     publishedHash: 'QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB',
  //     expDate: 1484554656
  //   })
  //
  //   LOCsManagerDAO.newLOCWatch((locModel) => {
  //     // address = locModel.getAddress()
  //     expect(locModel.name()).toEqual('1484554656')
  //     done()
  //   }, account).then(() =>
  //     store.dispatch(formActions.submitLOC(loc, account))
  //   )
  // })

  it('should NOT propose new LOC', () => {
    const loc = new LOCModel()

    return store.dispatch(formActions.submitLOC(loc)).then((r) =>
      expect(r).toBe(false)
    )
  })

  // it('should fetch LOCs', () => {
  //   return store.dispatch(actions.getLOCs(account)).then(() => {
  //     expect(store.getActions()[0].type).toEqual(LOCS_FETCH_START)
  //     expect(store.getActions()[1].type).toEqual(LOCS_LIST)
  //     const address_ = store.getActions()[1].data.keySeq().toArray()[0]
  //     expect(validateAddress(address_)).toEqual(null)
  //     expect(store.getActions()[2].type).toEqual(LOCS_FETCH_END)
  //   })
  // })

  // it('should fetch LOCs counter', () => {
  //   return store.dispatch(actions.getLOCsCounter(account)).then(() => {
  //     const action = store.getActions()[0]
  //     expect(action.type).toEqual(LOCS_COUNTER)
  //     expect(action.payload).toBeGreaterThanOrEqual(0)
  //   })
  // })

  // it('should update LOC', (done) => {
  //   LOCsManagerDAO.updLOCValueWatch((locAddr, settingName, value, instance) => {
  //     instance.stopWatching()
  //     expect(locAddr).toEqual(address)
  //     expect(value).toEqual(2000)
  //     done()
  //   })
  //
  //   const loc = new LOCModel({ address, issueLimit: 2000 })
  //   store.dispatch(formActions.submitLOC(loc, account))
  // })
  //
  // // TODO @dkchv: off
  // // it('should NOT update LOC', () => {
  // //   const loc = new LOCModel({ address: '0x6777151f532964a7cf234c1989564d3822c8210e', issueLimit: 2000 })
  // //   return store.dispatch(formActions.submitLOC(loc, account)).then((r) =>
  // //     expect(r).toBe(false)
  // //   )
  // // })
  //
  // it('should remove LOC', (done) => {
  //   LOCsManagerDAO.remLOCWatch((r) => {
  //     expect(r).toEqual(address)
  //     done()
  //   })
  //
  //   store.dispatch(formActions.removeLOC(address, account))
  // })

  // it('should NOT remove LOC', () => {
  //   return store.dispatch(formActions.removeLOC(0, 0)).then(() =>
  //     expect(store.getActions()).toContainEqual({payload: {modalProps:
  //       {message: 'Transaction canceled!', title: 'Remove LOC Error!'},
  //       modalType: 'modals/ALERT_TYPE'},
  //       type: 'modal/SHOW'})
  //   )
  // })
  //
  // it('should issue LH', () => {
  //   return store.dispatch(actions.issueLH({account, issueAmount: 48, address})).then(() =>
  //     expect(store.getActions()).toContainEqual({data: {address, value: true, valueName: 'isIssuing'}, type: LOC_UPDATE})
  //   )
  // })
  //
  // it('should redeem LH', () => {
  //   return store.dispatch(actions.redeemLH({account, redeemAmount: 47, address})).then(() =>
  //     expect(store.getActions()).toContainEqual({data: {address, value: false, valueName: 'isRedeeming'}, type: LOC_UPDATE})
  //   )
  // })
  //
  // it('should NOT redeem LH', () => {
  //   return store.dispatch(actions.redeemLH({account: 0, redeemAmount: 46, address: 0})).then(() =>
  //     expect(store.getActions()).toContainEqual({data: {address: 0, value: false, valueName: 'isRedeeming'}, type: LOC_UPDATE, result: 'error'})
  //   )
  // })
  //
  // it('should create an action to show what LOC is created', () => {
  //   const locModel = new LOCModel({address: 0x10})
  //   store.dispatch(actions.handleNewLOC(locModel, 995))
  //   expect(store.getActions()).toContainEqual({data: locModel, type: LOC_CREATE})
  // })
  //
  // it('should create an action to show what LOC is updated', () => {
  //   store.dispatch(actions.handleUpdateLOCValue(address, 'issued', 178))
  //   expect(store.getActions()).toContainEqual({data: {valueName: 'issued', value: 178, address}, type: LOC_UPDATE})
  // })
  //
  // it('should create an action to show what LOC is removed', () => {
  //   store.dispatch(actions.handleRemoveLOC(address))
  //   expect(store.getActions()).toContainEqual({data: {address}, type: LOC_REMOVE})
  // })
})
