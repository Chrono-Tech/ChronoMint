import Immutable from 'immutable'
import { mockStore, store, accounts, sleep } from 'specsInit'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import type OperationModel from 'models/OperationModel'
import type OperationNoticeModel from 'models/notices/OperationNoticeModel'
import CBEModel from 'models/CBEModel'
import * as a from './actions'

const cbe = new CBEModel({address: accounts[1], name: 'Jacob'})

let operation: OperationModel | AbstractFetchingModel

describe('operations actions', () => {

  beforeAll(async () => {
    const userDAO = await contractsManagerDAO.getUserManagerDAO()
    const dao = await contractsManagerDAO.getPendingManagerDAO()
    dao.setMemberId(await userDAO.getMemberId(accounts[0]))
  })

  it('should add second CBE, set required signatures to 2 and show proper operations settings', async () => {
    const userDAO = await contractsManagerDAO.getUserManagerDAO()
    await userDAO.addCBE(cbe)
    await store.dispatch(a.setRequiredSignatures(2))
    await store.dispatch(a.openOperationsSettings())

    expect(store.getActions()).toContainEqual({type: a.OPERATIONS_SIGNS_REQUIRED, required: 2})
    expect(store.getActions()).toContainEqual({type: a.OPERATIONS_ADMIN_COUNT, adminCount: 2})
    // TODO @bshevchenko: to contain equal new modal
  })

  it('should produce pending operation', async () => {
    await store.dispatch(a.watchInitOperations())
    store.dispatch(a.setRequiredSignatures(1))

    await sleep(5)

    const notice: OperationNoticeModel = store.getActions()[1].notice
    expect(notice.isRevoked()).toBeFalsy()

    operation = notice.operation()
    expect(operation.isConfirmed()).toBeTruthy()
    expect(operation.remained()).toEqual(1)

    expect(store.getActions()[2].operation).toEqual(operation)
  })

  it('should list pending operations', async () => {
    await store.dispatch(a.listOperations())
    const operationFromList = store.getActions()[1].list.get(operation.originId())
    expect(operationFromList.mockTxId(operation.tx().id())).toEqual(operation)
  })

  it('should revoke operation', async () => {
    await store.dispatch(a.revokeOperation(operation))
    expect(store.getActions()).toEqual([
      {type: a.OPERATIONS_SET, operation: operation.fetching()}
    ])
  })

  it('should produce another operation and confirm it', async () => {
    await store.dispatch(a.watchInitOperations())
    store.dispatch(a.setRequiredSignatures(1))

    await sleep(5)

    operation = store.getActions()[3].notice.operation()

    const newStore = mockStore()

    contractsManagerDAO.setAccount(accounts[1])

    await newStore.dispatch(a.watchInitOperations())
    await newStore.dispatch(a.confirmOperation(operation))

    await sleep(2)

    expect(newStore.getActions()[4].operation.isDone()).toBeTruthy()
  })

  it('should load more completed operations', async () => {
    await store.dispatch(a.loadMoreCompletedOperations())
    expect(store.getActions()).toEqual([
      {type: a.OPERATIONS_FETCH},
      {type: a.OPERATIONS_LIST, list: new Immutable.Map()}
    ])
  })

  afterAll(() => {
    contractsManagerDAO.setAccount(accounts[0])
  })
})
