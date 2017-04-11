import * as actions from '../../../src/redux/locs/actions'
import { LOCS_LIST, LOC_CREATE, LOC_UPDATE, LOC_REMOVE } from '../../../src/redux/locs/reducer'
import {LOCS_FETCH_START, LOCS_FETCH_END} from '../../../src/redux/locs/communication'
import UserDAO from '../../../src/dao/UserDAO'
import LOCsManagerDAO from '../../../src/dao/LOCsManagerDAO'
import {store} from '../../init'
import isEthAddress from '../../../src/utils/isEthAddress'
import LOCModel from '../../../src/models/LOCModel'

const account = UserDAO.web3.eth.accounts[0]
let address

describe('LOCs actions', () => {
  it('should propose new LOC', done => {
    const data = {
      locName: '1484554656',
      website: 'www.ru',
      issueLimit: 1000,
      publishedHash: 'QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB',
      expDate: 1484554656,
      account
    }

    LOCsManagerDAO.newLOCWatch((locModel) => {
      address = locModel.getAddress()
      expect(locModel.name()).toEqual('1484554656')
      done()
    }, account).then(() =>
      store.dispatch(actions.submitLOC(data))
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

  it('should update LOC', (done) => {
    LOCsManagerDAO.updLOCValueWatch((locAddr, settingName, value) => {
      expect(locAddr).toEqual(address)
            // expect(settingName).toEqual("issueLimit");
      expect(value).toEqual(2000)
      done()
    })

    const data = { address, issueLimit: 2000, account }
    store.dispatch(actions.submitLOC(data))
  })

  it('should remove LOC', (done) => {
    LOCsManagerDAO.remLOCWatch((r) => {
      expect(r).toEqual(address)
      done()
    })

    store.dispatch(actions.removeLOC(address, account, () => {}))
  })

  it('should create an action to show what LOC is created', () => {
    const locModel = new LOCModel({address: 0x10})
    store.dispatch(actions.handleNewLOC(locModel, 995))
    expect(store.getActions()[0]).toEqual({data: locModel, type: LOC_CREATE})
  })

  it('should create an action to show what LOC is updated', () => {
    store.dispatch(actions.handleUpdateLOCValue(address, 'issued', 178))
    expect(store.getActions()[0]).toEqual({data: {valueName: 'issued', value: 178, address}, type: LOC_UPDATE})
  })

  it('should create an action to show what LOC is removed', () => {
    store.dispatch(actions.handleRemoveLOC(address))
    expect(store.getActions()[0]).toEqual({data: {address}, type: LOC_REMOVE})
  })
})
