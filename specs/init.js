import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Web3 from 'web3'
import OrbitDAO from '../src/dao/OrbitDAO'
import AbstractContractDAO from '../src/dao/AbstractContractDAO'
import Reverter from '../test/helpers/reverter'
import web3provider from '../src/network/Web3Provider'
import localStorageStub from '../src/utils/localStorage/localStorageStub'
import ls from '../src/utils/localStorage/index'

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000

Object.defineProperty(window, 'localStorage', {
  value: localStorageStub
})

const web3 = new Web3()

web3provider.setWeb3(web3)
web3provider.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
web3provider.resolve()
const reverter = new Reverter(web3provider.getWeb3instance())

const mockStore = configureMockStore([thunk])
export let store = null

beforeAll((done) => {
  OrbitDAO.init(null)
  reverter.snapshot(done)
})

afterAll((done) => {
  reverter.revert(done)
})

beforeEach(() => {
  ls.clear()
  web3provider.setWeb3(web3)
  web3provider.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
  web3provider.resolve()
  AbstractContractDAO.stopWatching()
  store = mockStore()
})
