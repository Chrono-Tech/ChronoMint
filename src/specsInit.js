/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Reverter from 'chronobank-smart-contracts/test/helpers/reverter'
import customSerializer from '@chronobank/core-dependencies/utils/CustomSerializer'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-enzyme'
import { BTC_TESTNET_NODE } from '@chronobank/login/network/BitcoinNode'
import { LOCAL_ID } from '@chronobank/login/network/settings'
import web3provider from '@chronobank/login/network/Web3Provider'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Web3 from 'web3'
import MarketSocket from '@chronobank/core/market/MarketSocket'
import LocalStorage from '@chronobank/core-dependencies/utils/LocalStorage'

Enzyme.configure({ adapter: new Adapter() })
// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

// @todo Check tests using new Web3
const web3 = new Web3()
web3provider.reinit(web3, new web3.providers.HttpProvider('http://localhost:8545'))
web3provider.resolve()
export const accounts = web3.eth.accounts

// FIXME revive somehow
// AbstractContractDAO.setup(accounts[0], [resultCodes.OK, true], resultCodes)

const reverter = new Reverter(web3provider.getWeb3instance())

export const mockStore = configureMockStore([thunk])
// eslint-disable-next-line import/no-mutable-exports
export let store = null

beforeAll((done) => {
  web3provider.getWeb3().then(() => {
    // noinspection JSUnresolvedFunction
    reverter.snapshot(done)
  })
})

afterAll((done) => {
  // noinspection JSUnresolvedFunction
  reverter.revert(done)
  BTC_TESTNET_NODE.disconnect()
  MarketSocket.disconnect()
})

beforeEach(() => {
  // NOTE: session is always as CBE
  LocalStorage.createSession(accounts[0], LOCAL_ID, LOCAL_ID)
  store = mockStore()
})

afterEach(async (done) => {
  LocalStorage.destroySession()
  done()
})

expect.addSnapshotSerializer(customSerializer)
