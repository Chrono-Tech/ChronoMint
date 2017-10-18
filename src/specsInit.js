import Reverter from 'chronobank-smart-contracts/test/helpers/reverter'
import Web3 from 'web3'
import configureMockStore from 'redux-mock-store'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import thunk from 'redux-thunk'

import AbstractContractDAO from './dao/AbstractContractDAO'
import { LOCAL_ID } from './network/settings'
import ls from './utils/LocalStorage'
import web3provider from './network/Web3Provider'

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

const web3 = new Web3()

web3provider.setWeb3(web3)
web3provider.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
web3provider.resolve()
export const accounts = web3.eth.accounts

AbstractContractDAO.setup(accounts[0], [resultCodes.OK, true], resultCodes)

const reverter = new Reverter(web3provider.getWeb3instance())

export const mockStore = configureMockStore([thunk])
export let store = null

beforeAll(done => {
  web3provider.getWeb3().then(() => {
    // noinspection JSUnresolvedFunction
    reverter.snapshot(done)
  })
})

afterAll(done => {
  // noinspection JSUnresolvedFunction
  reverter.revert(done)
})

beforeEach(() => {
  // NOTE: session is always as CBE
  ls.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
  store = mockStore()
})

afterEach(async done => {
  ls.destroySession()
  await AbstractContractDAO.stopWholeWatching()
  done()
})
)
