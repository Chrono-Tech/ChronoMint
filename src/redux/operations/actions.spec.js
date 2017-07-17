import { store, accounts } from 'specsInit'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
// import type OperationModel from 'models/OperationModel'
import CBEModel from 'models/CBEModel'
import * as a from './actions'

const cbe = new CBEModel({address: accounts[1], name: 'Jacob'})

// let operation: OperationModel

describe('operations actions', () => {
  it.skip('should add second CBE, set required signatures to 2 and show proper operations settings', async () => {
    const userDAO = await contractsManagerDAO.getUserManagerDAO()
    await userDAO.addCBE(cbe)
    await store.dispatch(a.setRequiredSignatures(2))
    await store.dispatch(a.openOperationsSettings())

    expect(store.getActions()).toEqual([

    ])
  })

  it.skip('should produce pending operation', async () => {
    await store.dispatch(a.watchInitOperations())
    await store.dispatch(a.setRequiredSignatures(1))

    expect(store.getActions()).toEqual([

    ])

    // TODO operation =
  })

  it.skip('should list pending operations', async () => {
    await store.dispatch(a.listOperations())

    expect(store.getActions()).toEqual([

    ])
  })

  it.skip('should revoke operation', async () => {
    // TODO
    // await store.dispatch(a.revokeOperation(operation))
    // expect(store.getActions()).toEqual([
    //
    // ])
  })

  it.skip('should produce another operation and confirm it', async () => {
    // await store.dispatch(a.setRequiredSignatures(1))
    //
    // // TODO operation =
    //
    // await store.dispatch(a.revokeOperation(operation))
    //
    // expect(store.getActions()).toEqual([
    //
    // ])
  })

  it.skip('should load more completed operations', async () => {
    // await store.dispatch(a.loadMoreCompletedOperations())
    // expect(store.getActions()).toEqual([
    //
    // ])
  })

  // TODO probably is unnecessary
  // it.skip('should watch operation', () => {
  //   // TODO
  // })

  // TODO @bshevchenko: update cbe tests with such strategy
})
