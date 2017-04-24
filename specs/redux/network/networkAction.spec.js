import * as actions from '../../../src/redux/network/networkAction'
import { NETWORK_SET_TEST_RPC, NETWORK_SET_WEB3, NETWORK_SET_ACCOUNTS, NETWORK_CLEAR_ERRORS, NETWORK_SELECT_ACCOUNT } from '../../../src/redux/network/networkReducer'
import {store} from '../../init'
import Web3ProvidersName from '../../../src/network/Web3ProviderNames'
// import Web3 from 'web3'
// import web3Provider from '../../../src/network/Web3Provider'
// import uportProvider from '../../../src/network/UportProvider'
// import localStorageKeys from '../../../src/constants/localStorageKeys'
// import ls from '../../../src/utils/localStorage'

// const metaMaskWeb3Instance = new Web3()

// describe('network actions', () => {
  // beforeEach(() => {
  //   window.web3 = metaMaskWeb3Instance
  // })

  // it('should check TESTRPC is running', () => {
  //   return store.dispatch(actions.checkTestRPC()).then(() => {
  //     expect(store.getActions()[0]).toEqual({
  //       type: NETWORK_SET_TEST_RPC,
  //       isTestRPC: true
  //     })
  //   })
  // })

  // it('should set local web3 instance and its provider', () => {
  //   store.dispatch(actions.setWeb3(Web3ProvidersName.LOCAL))
  //   expect(store.getActions()[0]).toEqual({
  //     type: NETWORK_SET_WEB3,
  //     providerName: Web3ProvidersName.LOCAL
  //   })
  //   const web3 = web3Provider.getWeb3instance()
  //   expect(web3 instanceof Web3).toBeTruthy()
  //   store.dispatch(actions.setWeb3ProviderByName(Web3ProvidersName.LOCAL))
  //   expect(web3.currentProvider).toEqual(new Web3.providers.HttpProvider('http://localhost:8545'))
  // })

  // it('should set MetaMask web3 instance and its provider', () => {
  //   store.dispatch(actions.setWeb3(Web3ProvidersName.METAMASK))
  //   expect(store.getActions()[0]).toEqual({
  //     type: NETWORK_SET_WEB3,
  //     providerName: Web3ProvidersName.METAMASK
  //   })
  //   const web3 = web3Provider.getWeb3instance()
  //   expect(web3).toEqual(window.web3)
  //   store.dispatch(actions.setWeb3ProviderByName(Web3ProvidersName.METAMASK))
  //   expect(web3.currentProvider).toBe(window.web3.currentProvider)
  // })

  // it('should set UPort web3 instance', () => {
  //   return new Promise((resolve) => {
  //     store.dispatch(actions.setWeb3(Web3ProvidersName.UPORT))
  //     expect(store.getActions()[0]).toEqual({
  //       type: NETWORK_SET_WEB3,
  //       providerName: Web3ProvidersName.UPORT
  //     })
  //     resolve(uportProvider.getProvider())
  //   }).then((provider) => {
  //     store.dispatch(actions.setWeb3ProviderByName(Web3ProvidersName.UPORT))
  //     expect(provider).toBeTruthy()
  //   })
  // })

  // it('should clear web3 state and errors', () => {
  //   ls(localStorageKeys.WEB3_PROVIDER, Web3ProvidersName.METAMASK)
  //   store.dispatch(actions.clearWeb3Provider())
  //   expect(store.getActions()).toEqual([
  //     { type: NETWORK_SET_WEB3, providerName: null },
  //     { type: NETWORK_SET_ACCOUNTS, accounts: [] },
  //     { type: NETWORK_CLEAR_ERRORS }
  //   ])
  // })

  // it('should select account', () => {
  //   web3Provider.setWeb3(new Web3())
  //   web3Provider.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))
  //   const selected = web3Provider.getWeb3instance().eth.accounts[1]
  //   store.dispatch(actions.selectAccount(selected))
  //   expect(store.getActions()).toEqual([{
  //     type: NETWORK_SELECT_ACCOUNT,
  //     selectedAccount: selected
  //   }])
  // })

  // it('should load accounts', () => {
  //   web3Provider.setWeb3(new Web3())
  //   web3Provider.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))
  //   const accounts = web3Provider.getWeb3instance().eth.accounts
  //   return store.dispatch(actions.loadAccounts()).then(() => {
  //     expect(store.getActions()).toEqual([
  //       {type: NETWORK_SET_ACCOUNTS, accounts: []},
  //       {type: NETWORK_SET_ACCOUNTS, accounts}
  //     ])
  //   })
  // })
// })
