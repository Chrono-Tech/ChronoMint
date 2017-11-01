import { store } from 'specsInit'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import LOCModel from 'models/LOCModel'
import * as a from './actions'

const loc1 = new LOCModel({
  name: 'loc1',
  oldName: 'loc1',
  website: 'dkchv.ru',
  createDate: Date.now(),
  expDate: Date.now(),
})

const loc2 = new LOCModel({
  name: 'loc2',
  oldName: 'loc2',
  website: 'dkchv2.ru',
  createDate: Date.now(),
  expDate: Date.now(),
})

describe('LOCs actions', () => {
  it('should subscribe on watch', async () => {
    const locManager = await contractsManagerDAO.getLOCManagerDAO()
    spyOn(locManager, '_watch').and.returnValue(Promise.resolve())

    await store.dispatch(a.watchInitLOC())
    // TODO @bshevchenko: protected member is not accessible! Refactor this!
    expect(locManager._watch.calls.argsFor(0)[0]).toEqual('NewLOC')
    expect(locManager._watch.calls.argsFor(1)[0]).toEqual('UpdateLOC')
    expect(locManager._watch.calls.argsFor(2)[0]).toEqual('UpdLOCStatus')
    expect(locManager._watch.calls.argsFor(3)[0]).toEqual('RemLOC')
    expect(locManager._watch.calls.argsFor(4)[0]).toEqual('Reissue')
    expect(locManager._watch.calls.argsFor(5)[0]).toEqual('Revoke')
  })

  it.skip('should add LOC', async (done) => {
    const watchCallback = (loc) => {
      const actions = store.getActions()
      expect(actions[0].type).toEqual(a.LOC_CREATE)
      expect(loc.get('name')).toEqual('loc1')
      done()
    }
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.watchNewLOC(watchCallback)
    await store.dispatch(a.addLOC(loc1))
  })

  it.skip('should get LOCs list', async (done) => {
    const watchCallback = async () => {
      await store.dispatch(a.getLOCs())
      const actions = store.getActions()

      expect(actions[1].type).toEqual(a.LOCS_LIST_FETCH)
      expect(actions[2].type).toEqual(a.LOCS_LIST)
      expect(actions[2].locs.size).toEqual(1)

      const fetchedLOC = actions[2].locs.get('loc1').toJS()
      expect(fetchedLOC.name).toEqual('loc1')
      expect(fetchedLOC.website).toEqual('dkchv.ru')
      done()
    }

    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.watchNewLOC(watchCallback)
    await store.dispatch(a.addLOC(loc1))
  })

  it.skip('should update LOC', async (done) => {
    // 3
    const watchUpdateCallback = (loc) => {
      // TODO @dkchv: wrong answer in SC, wait for update
      const actions = store.getActions()
      expect(actions[1]).toEqual({ type: a.LOC_REMOVE, name: loc2.get('oldName') })
      expect(actions[2]).toEqual({ type: a.LOC_UPDATE, loc: loc2.isPending(true) })
      expect(loc.get('name')).toEqual('loc2')
      expect(loc.get('website')).toEqual('dkchv2.ru')
      done()
    }

    // 2
    const watchAddCallback = async () => {
      await store.dispatch(a.updateLOC(loc2))
    }

    // 1
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.watchNewLOC(watchAddCallback)
    await locManagerDAO.watchUpdateLOC(watchUpdateCallback)
    await store.dispatch(a.addLOC(loc1))
  })

  // TODO @dkchv: multisig return false
  it.skip('should remove LOC', async (done) => {
    // 3 catch remove
    const watchRemoveCallback = (name) => {
      const actions = store.getActions()
      expect(actions[2].type).toEqual(a.LOC_REMOVE)
      expect(name).toEqual('loc1')
      done()
    }
    // 2 remove
    const watchAddCallback = async () => {
      await store.dispatch(a.removeLOC(loc1))
    }
    // 1 watch and create
    const locManagerDAO = await contractsManagerDAO.getLOCManagerDAO()
    await locManagerDAO.watchNewLOC(watchAddCallback)
    await locManagerDAO.watchRemoveLOC(watchRemoveCallback)
    await store.dispatch(a.addLOC(loc1))
  })

  // TODO @dkchv: multisig too
  it.skip('should issue asset', () => {

  })

  // TODO @dkchv: multisig too
  it.skip('should revoke asset', () => {

  })

  // TODO @dkchv: multisig too
  it.skip('should update status', () => {

  })
})
