import { store, accounts } from 'specsInit'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { TX_SET_REQUIRED_SIGNS } from 'dao/UserManagerDAO'
import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import CBEModel from 'models/CBEModel'
import type OperationModel from 'models/OperationModel'
import type OperationNoticeModel from 'models/notices/OperationNoticeModel'
import * as a from './actions'

const cbe = new CBEModel({ address: accounts[ 1 ], name: 'Jacob' })

let operation: OperationModel | AbstractFetchingModel

describe('operations actions', () => {
  afterEach(async (done) => {
    await setTimeout(() => {
      done()
    }, 3000)
  })
  beforeAll(async () => {
    const userDAO = await contractsManagerDAO.getUserManagerDAO()
    const dao = await contractsManagerDAO.getPendingManagerDAO()
    dao.setMemberId(await userDAO.getMemberId(accounts[ 0 ]))
  })

  it('should add second CBE, set required signatures to 2 and show proper operations settings', async () => {
    const userDAO = await contractsManagerDAO.getUserManagerDAO()
    await userDAO.addCBE(cbe)
    await store.dispatch(a.setRequiredSignatures(2))
    await store.dispatch(a.setupOperationsSettings())

    expect(store.getActions()).toContainEqual({ type: a.OPERATIONS_SIGNS_REQUIRED, required: 2 })
    expect(store.getActions()[ 1 ].adminCount).toBeGreaterThanOrEqual(2)
  })

  it('should produce pending operation', async (done) => {
    const dao = await contractsManagerDAO.getPendingManagerDAO()
    await dao.watchConfirmation((notice: OperationNoticeModel) => {

      operation = notice.operation()

      expect(notice.isRevoked()).toBeFalsy()
      expect(operation.isConfirmed()).toBeTruthy()
      expect(operation.remained()).toEqual(1)

      const tx = operation.tx()
      expect(tx.funcName()).toEqual(TX_SET_REQUIRED_SIGNS)

      done()
    })

    await store.dispatch(a.setRequiredSignatures(1))
  })

  it('should list pending operations', async () => {
    await store.dispatch(a.listOperations())
    const operationFromList = store.getActions()[ 1 ].list.get(operation.originId())
    expect(operationFromList.mockTxId(operation.tx().id())).toEqual(operation)
  })

  it('should produce another operation and confirm it', async (done) => {
    const dao = await contractsManagerDAO.getPendingManagerDAO()
    await dao.watchDone((operation: OperationModel) => {
      const tx = operation.tx()
      expect(tx.funcName()).toEqual(TX_SET_REQUIRED_SIGNS)
      expect(operation.isDone()).toBeTruthy()
      done()
    })

    contractsManagerDAO.setAccount(accounts[ 1 ])
    await store.dispatch(a.confirmOperation(operation))
  })

  it('should revoke operation', async () => {
    store.clearActions()
    await store.dispatch(a.revokeOperation(operation))
    expect(store.getActions()[ 0 ]).toEqual({ type: a.OPERATIONS_SET, operation: operation.isFetching(true) })
  })

  // TODO @ipavlenko: Write better test:
  // - 1) Try to exceed OPERATIONS_PER_PAGE limit
  // - 2) Do not replace operations list since it contains pending operations too. Merge instead.
  // - 3) Implement paging in PendingManagerDAO
  // - 4) Fix reducer, add support of paging
  it.skip('should load more completed operations', async () => {
    await store.dispatch(a.loadMoreCompletedOperations())
    expect(store.getActions()).toMatchSnapshot()
  })

  afterAll(() => {
    contractsManagerDAO.setAccount(accounts[ 0 ])
  })
})
