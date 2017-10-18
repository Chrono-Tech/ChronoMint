import Immutable from 'immutable'
import { store, accounts } from 'specsInit'
import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import type OperationModel from 'models/OperationModel'
import type OperationNoticeModel from 'models/notices/OperationNoticeModel'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { TX_SET_REQUIRED_SIGNS } from 'dao/UserManagerDAO'
import CBEModel from 'models/CBEModel'
import * as a from './actions'

const cbe = new CBEModel({ address: accounts[1], name: 'Jacob' })

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
    await store.dispatch(a.setupOperationsSettings())

    expect(store.getActions()).toContainEqual({ type: a.OPERATIONS_SIGNS_REQUIRED, required: 2 })
    expect(store.getActions()[1].adminCount).toBeGreaterThanOrEqual(2)
  })

  it('should produce pending operation', async resolve => {
    const dao = await contractsManagerDAO.getPendingManagerDAO()
    await dao.watchConfirmation((notice: OperationNoticeModel) => {
      expect(notice.isRevoked()).toBeFalsy()
      expect(notice.operation().isConfirmed()).toBeTruthy()
      expect(notice.operation().remained()).toEqual(1)

      operation = notice.operation()

      expect(operation.tx().funcName()).toEqual(TX_SET_REQUIRED_SIGNS)

      resolve()
    })

    await store.dispatch(a.setRequiredSignatures(1))
  })

  it('should list pending operations', async () => {
    await store.dispatch(a.listOperations())
    const operationFromList = store.getActions()[1].list.get(operation.originId())
    expect(operationFromList.mockTxId(operation.tx().id())).toEqual(operation)
  })

  it('should revoke operation', async () => {
    await store.dispatch(a.revokeOperation(operation))
    expect(store.getActions()).toEqual([
      { type: a.OPERATIONS_SET, operation: operation.fetching() },
    ])
  })

  it('should produce another operation and confirm it', async resolve => {
    const dao = await contractsManagerDAO.getPendingManagerDAO()
    await dao.watchDone((operation: OperationModel) => {
      expect(operation.tx().funcName()).toEqual(TX_SET_REQUIRED_SIGNS)
      expect(operation.isDone()).toBeTruthy()
      resolve()
    })

    await store.dispatch(a.setRequiredSignatures(1))

    contractsManagerDAO.setAccount(accounts[1])
    await store.dispatch(a.confirmOperation(operation))
  })

  // TODO @ipavlenko: Write better test:
  // - 1) Try to exceed OPERATIONS_PER_PAGE limit
  // - 2) Do not replace operations list since it contains pending operations too. Merge instead.
  // - 3) Implement paging in PendingManagerDAO
  // - 4) Fix reducer, add support of paging
  it.skip('should load more completed operations', async () => {
    await store.dispatch(a.loadMoreCompletedOperations())
    expect(store.getActions()).toEqual([
      { type: a.OPERATIONS_FETCH },
      { type: a.OPERATIONS_LIST, list: new Immutable.Map() },
    ])
  })

  afterAll(() => {
    contractsManagerDAO.setAccount(accounts[0])
  })
})
