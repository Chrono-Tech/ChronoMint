import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Web3 from 'web3'
import initLocalStorageMock from './mock/localStorage'
import OrbitDAO from '../src/dao/OrbitDAO'
import AbstractContractDAO from '../src/dao/AbstractContractDAO'
import Reverter from '../test/helpers/reverter'
import web3provider from '../src/network/Web3Provider'

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

initLocalStorageMock()

web3provider.setWeb3(new Web3())
web3provider.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))
web3provider.resolve()
const reverter = new Reverter(web3provider.getWeb3instance())

const mockStore = configureMockStore([thunk])
export let store = null

beforeAll((done) => {
  window.resolveWeb3 = Promise.resolve(null)
  OrbitDAO.init(null)
  reverter.snapshot(done)
})

afterAll((done) => {
  reverter.revert(done)
})

beforeEach(() => {
  window.localStorage.clear()
  AbstractContractDAO.stopWatching()
  store = mockStore()
})
