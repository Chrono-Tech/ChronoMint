import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Web3 from 'web3'
import OrbitDAO from '../src/dao/OrbitDAO'
import AbstractContractDAO from '../src/dao/AbstractContractDAO'
import Reverter from '../test/helpers/reverter'
import web3provider from '../src/network/Web3Provider'
import ls from '../src/utils/localStorage'

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000

// local storage mock
// Object.defineProperty(window, 'localStorage', {
//   value: (() => {
//     let store = {}
//     // noinspection JSUnusedGlobalSymbols
//     return {
//       getItem: (key) => store[key],
//       setItem: (key, value) => {
//         store[key] = value.toString()
//       },
//       removeItem: (key) => {
//         delete store[key]
//       },
//       length: () => Object.keys(store).length,
//       clear: () => {
//         store = {}
//       }
//     }
//   })()
// })

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
  ls.clear()
  AbstractContractDAO.stopWatching()
  store = mockStore()
})
