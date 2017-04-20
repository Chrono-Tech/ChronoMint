import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Web3 from 'web3'
import OrbitDAO from '../src/dao/OrbitDAO'
import AbstractContractDAO from '../src/dao/AbstractContractDAO'
import Reverter from '../test/helpers/reverter'

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

// local storage mock
Object.defineProperty(window, 'localStorage', {
  value: (() => {
    let store = {}
    // noinspection JSUnusedGlobalSymbols
    return {
      getItem: (key) => store[key],
      setItem: (key, value) => {
        store[key] = value.toString()
      },
      length: () => Object.keys(store).length,
      clear: () => {
        store = {}
      }
    }
  })()
})

AbstractContractDAO._web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const reverter = new Reverter(AbstractContractDAO._web3)

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
