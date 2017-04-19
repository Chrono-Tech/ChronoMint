import * as actions from '../../../src/redux/locs/list/actions'
import * as formActions from '../../../src/redux/locs/locForm/actions'
import { LOCS_LIST, LOC_CREATE, LOC_UPDATE, LOC_REMOVE } from '../../../src/redux/locs/list/reducer'
import {LOCS_FETCH_START, LOCS_FETCH_END} from '../../../src/redux/locs/commonProps/'
import {LOCS_COUNTER} from '../../../src/redux/locs/counter'
import UserDAO from '../../../src/dao/UserDAO'
import LOCsManagerDAO from '../../../src/dao/LOCsManagerDAO'
import {store} from '../../init'
import isEthAddress from '../../../src/utils/isEthAddress'
import LOCModel from '../../../src/models/LOCModel'

const account = UserDAO.web3.eth.accounts[0]
let address

describe('LOCs actions', () => {
  it('should propose new LOC', done => {
    const loc = new LOCModel({
      locName: '1484554656',
      website: 'www.ru',
      issueLimit: 1000,
      publishedHash: 'QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB',
      expDate: 1484554656
    })

    LOCsManagerDAO.newLOCWatch((locModel) => {
      address = locModel.getAddress()
      expect(locModel.name()).toEqual('1484554656')
      done()
    }, account).then(() =>
      store.dispatch(formActions.submitLOC(loc, account))
    )
  })

  it('should fetch LOCs', () => {
    return store.dispatch(actions.getLOCs(account)).then(() => {
      expect(store.getActions()[0].type).toEqual(LOCS_FETCH_START)
      expect(store.getActions()[1].type).toEqual(LOCS_LIST)
      const address_ = store.getActions()[1].data.keySeq().toArray()[0]
      expect(isEthAddress(address_)).toBeTruthy()
      expect(store.getActions()[2].type).toEqual(LOCS_FETCH_END)
    })
  })

  it('should fetch LOCs counter', () => {
    return store.dispatch(actions.getLOCsCounter(account)).then(() => {
      const action = store.getActions()[0]
      expect(action.type).toEqual(LOCS_COUNTER)
      expect(action.payload).toBeGreaterThanOrEqual(0)
    })
  })

  it('should update LOC', (done) => {
    LOCsManagerDAO.updLOCValueWatch((locAddr, settingName, value) => {
      expect(locAddr).toEqual(address)
            // expect(settingName).toEqual("issueLimit");
      expect(value).toEqual(2000)
      done()
    })

    const loc = new LOCModel({ address, issueLimit: 2000 })
    store.dispatch(formActions.submitLOC(loc, account))
  })

  it('should remove LOC', (done) => {
    LOCsManagerDAO.remLOCWatch((r) => {
      expect(r).toEqual(address)
      done()
    })

    store.dispatch(formActions.removeLOC(address, account, () => {}))
  })

  it('should create an action to show what LOC is created', () => {
    const locModel = new LOCModel({address: 0x10})
    store.dispatch(actions.handleNewLOC(locModel, 995))
    expect(store.getActions()).toContainEqual({data: locModel, type: LOC_CREATE})
  })

  it('should create an action to show what LOC is updated', () => {
    store.dispatch(actions.handleUpdateLOCValue(address, 'issued', 178))
    expect(store.getActions()).toContainEqual({data: {valueName: 'issued', value: 178, address}, type: LOC_UPDATE})
  })

  it('should create an action to show what LOC is removed', () => {
    store.dispatch(actions.handleRemoveLOC(address))
    expect(store.getActions()).toContainEqual({data: {address}, type: LOC_REMOVE})
  })
})
