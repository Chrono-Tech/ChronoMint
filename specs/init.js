import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Web3 from 'web3'
import AbstractContractDAO from '../src/dao/AbstractContractDAO'
import Reverter from 'chronobank-smart-contracts/test/helpers/reverter'
import web3provider from '../src/network/Web3Provider'
import LS from '../src/dao/LocalStorageDAO'

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

const web3 = new Web3()

web3provider.setWeb3(web3)
web3provider.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
web3provider.resolve()
const reverter = new Reverter(web3provider.getWeb3instance())

const mockStore = configureMockStore([thunk])
export let store = null

beforeAll((done) => {
  web3provider.getWeb3().then(() => {
    reverter.snapshot(done)
  })
})

afterAll((done) => {
  AbstractContractDAO.stopWatching()
  reverter.revert(done)
})

beforeEach(() => {
  LS.clear()
  store = mockStore()
})
