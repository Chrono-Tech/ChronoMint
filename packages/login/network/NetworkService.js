/**
 * THIS FILE IS STILL HERE ONLY FOR CODE REVIEW!
*/




// // #region imports

// import contractsManagerDAO from '@chronobank/core/dao/ContractsManagerDAO'
// import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
// import { AccountCustomNetwork } from '@chronobank/core/models/wallet/persistAccount'
// import EventEmitter from 'events'
// import {
//   addError,
//   clearErrors,
//   loading,
//   networkResetNetwork,
//   networkSetAccounts,
//   networkSetNetwork,
//   networkSetProvider,
//   selectAccount,
//   setTestMetamask,
// } from '../redux/network/actions'
// import { checkTestRPC } from '../redux/network/utils'
// import { utils as web3Converter } from '../settings'
// import metaMaskResolver from './metaMaskResolver'
// import { NETWORK_STATUS_OFFLINE, NETWORK_STATUS_ONLINE } from './MonitorService'
// import privateKeyProvider from './privateKeyProvider'
// import {
//   getNetworkById,
//   getNetworksByProvider,
//   getScannerById,
//   LOCAL_ID,
//   LOCAL_PRIVATE_KEYS,
//   LOCAL_PROVIDER_ID,
//   NETWORK_MAIN_ID,
// } from './settings'
// import uportProvider, { UPortAddress } from './uportProvider'
// import web3Provider from './Web3Provider'
// import setup from './EngineUtils'
// import { DUCK_NETWORK } from '../redux/network/constants'

// //#endregion imports

// // TODO: to ad I18n translation
// const ERROR_NO_ACCOUNTS = 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'

// class NetworkService extends EventEmitter {
//   connectStore (store) {
//     this._store = store
//     this._dispatch = store.dispatch
//   }
//   // Moved to packages/core/redux/session/thunks.js
//   // createNetworkSession = (account, provider, network) => {
//   //   if (!this._account) {
//   //     this._account = account
//   //   }

//   //   if (!account || !provider || !network) {
//   //     throw new Error(`Wrong session arguments: account: ${account}, provider: ${provider}, network: ${network}`)
//   //   }

//   //   this.emit('createSession', {
//   //     account, provider, network, dispatch: this._dispatch,
//   //   })
//   // }

//   // Moved to packages/core/redux/session/thunks.js
//   // async destroyNetworkSession (lastURL, isReset = true) {
//   //   if (isReset) {
//   //     // for tests
//   //     web3Provider.beforeReset()
//   //     web3Provider.afterReset()
//   //   }

//   //   this.emit('destroySession', { lastURL, dispatch: this._dispatch })
//   // }

//   // Moved to network/thunks.
//   // async checkLocalSession (account, providerURL) {
//   //   const isTestRPC = checkTestRPC(providerURL)
//   //   // testRPC must be exists
//   //   if (!isTestRPC || !account) {
//   //     return false
//   //   }

//   //   // contacts and network must be valid
//   //   const isDeployed = await this.checkNetwork()
//   //   if (!isDeployed) {
//   //     return false
//   //   }

//   //   // all tests passed
//   //   return true
//   // }

//   // Moved to login/redux/netowrk/thunks
//   // async checkNetwork () {
//   //   const dispatch = this._dispatch
//   //   dispatch(loading())
//   //   const isDeployed = await contractsManagerDAO.isDeployed()
//   //   if (!isDeployed) {
//   //     dispatch(addError('Network is unavailable.'))
//   //   }
//   //   //return isDeployed
//   //   return true
//   // }

//   // Moved as is to packages/login/redux/network/thunks.js
//   // selectProvider = (selectedProviderId) => {
//   //   const dispatch = this._dispatch
//   //   dispatch(networkResetNetwork())
//   //   dispatch(networkSetProvider(selectedProviderId))
//   // }

//   // It was replaced to direct direct call of the action networkSetNetwork
//   // selectNetwork = (selectedNetworkId) => {
//   //   this._dispatch(networkSetNetwork(selectedNetworkId))
//   // }

//   // Moved to login/redux/netowrk/thunks
//   // async loginUport () {
//   //   const dispatch = this._dispatch
//   //   const provider = uportProvider.getUportProvider()
//   //   dispatch(loading())
//   //   dispatch(clearErrors())
//   //   web3Provider.reinit(provider.getWeb3(), provider.getProvider())
//   //   const encodedAddress: string = await provider.requestAddress()
//   //   const { network, address }: UPortAddress = uportProvider.decodeMNIDaddress(encodedAddress)
//   //   dispatch(this.selectNetwork(web3Converter.hexToDecimal(network)))
//   //   dispatch(networkSetAccounts([address]))
//   //   this.selectAccount(address)
//   // }

//   // Moved as is to packages/login/redux/network/thunks.js
//   // async loadAccounts () {
//   //   const dispatch = this._dispatch
//   //   dispatch(loading())
//   //   dispatch(networkSetAccounts([]))
//   //   try {
//   //     let accounts = this._accounts
//   //     if (accounts == null) {
//   //       accounts = await web3Provider.getAccounts()
//   //     }
//   //     if (!accounts || accounts.length === 0) {
//   //       throw new Error(ERROR_NO_ACCOUNTS)
//   //     }
//   //     dispatch(networkSetAccounts(accounts))
//   //     if (accounts.length === 1) {
//   //       this.selectAccount(accounts[0])
//   //     }
//   //     dispatch(loading(false))
//   //     return accounts
//   //   } catch (e) {
//   //     dispatch(addError(e.message))
//   //   }
//   // }

//   // Moved as is to packages/login/redux/network/thunks.js
//   // async restoreLocalSession (account, wallets) {
//   //   this.selectProvider(LOCAL_PROVIDER_ID)
//   //   this.selectNetwork(LOCAL_ID)
//   //   const accounts = await this.loadAccounts()
//   //   this.selectAccount(account)

//   //   const index = Math.max(accounts.indexOf(account), 0)
//   //   const provider = privateKeyProvider.getPrivateKeyProvider(LOCAL_PRIVATE_KEYS[index], this.getProviderSettings(), wallets)
//   //   await setup(provider)
//   // }

//   // Not used anymore, we can use action directly
//   // selectAccount = (selectedAccount) => {
//   //   this._dispatch(selectAccount(selectedAccount))
//   // }

//   // Now we are using appropriate action from login/redux/network/actions directly
//   // setAccounts = (accounts) => {
//   //   this._accounts = accounts
//   // }

//   // This method does not used anywhere
//   // getScanner = (networkId, providerId, api) => getScannerById(networkId, providerId, api)

//   // Moved as is to packages/login/redux/network/thunks.js
//   // getProviderSettings = () => {
//   //   const state = this._store.getState()

//   //   const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
//   //   const { selectedNetworkId, selectedProviderId, isLocal } = state.get(DUCK_NETWORK)
//   //   const network = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)

//   //   const { protocol, host } = network

//   //   if (!host) {

//   //     const customNetwork: AccountCustomNetwork = customNetworksList.find((network) => network.id === selectedNetworkId)

//   //     return {
//   //       network: customNetwork,
//   //       url: customNetwork && customNetwork.url,
//   //     }
//   //   }

//   //   return {
//   //     network,
//   //     url: protocol ? `${protocol}://${host}` : `//${host}`,
//   //   }
//   // }

//   // Moved as is to login/redux/network/thunks
//   // getProviderURL = () => {
//   //   const state = this._store.getState()
//   //   const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
//   //   const { selectedNetworkId, selectedProviderId, isLocal } = state.get(DUCK_NETWORK)
//   //   const { protocol, host } = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)

//   //   if (!host) {

//   //     const customNetwork: AccountCustomNetwork = customNetworksList.find((network) => network.id === selectedNetworkId)

//   //     return customNetwork && customNetwork.url
//   //   }
//   //   return protocol ? `${protocol}://${host}` : `//${host}`
//   // }

//   // Moved to login/redux/network/thunks as getNetworkName
//   // getName = () => {
//   //   const state = this._store.getState()
//   //   const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
//   //   const { selectedNetworkId, selectedProviderId, isLocal } = state.get(DUCK_NETWORK)
//   //   const network = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)

//   //   const { name } = network

//   //   if (!network.host) {

//   //     const customNetwork: AccountCustomNetwork = customNetworksList.find((network) => network.id === selectedNetworkId)

//   //     return customNetwork && customNetwork.name
//   //   }

//   //   return name
//   // }

//   // Moved as is into packages/login/redux/network/thunks
//   // checkMetaMask = () => {
//   //   metaMaskResolver
//   //     .on('resolve', (isMetaMask) => {
//   //       try {
//   //         if (isMetaMask) {
//   //           this._dispatch(setTestMetamask())
//   //           this.isMetamask = true
//   //         }
//   //       } catch (e) {
//   //         // eslint-disable-next-line
//   //         console.error(e)
//   //       }
//   //     })
//   //     .start()
//   // }

//   // Moved as is into packages/login/redux/network/thunks
//   // Replaced/fixed to use redux
//   // isMetaMask = () => {
//   //   return this.isMetamask
//   // }

//   // Moved as is into packages/login/redux/network/utils.js
//   // async checkTestRPC (/*providerUrl*/) {
//   //   return false
//   // }

//   // Moved as is to packages/login/redux/network/thunks.js
//   // async autoSelect () {
//   //   const { priority, preferMainnet } = this._store.getState().get(DUCK_NETWORK)
//   //   const selectAndResolve = (networkId, providerId) => {
//   //     this.selectProvider(providerId)
//   //     this.selectNetwork(networkId)
//   //   }

//   //   this.checkerIndex = 0

//   //   this.checkers = []

//   //   const handleNetwork = (status) => {
//   //     switch (status) {
//   //       case NETWORK_STATUS_OFFLINE:
//   //         runNextChecker()
//   //         break
//   //       case NETWORK_STATUS_ONLINE:
//   //         resetCheckers()
//   //         break
//   //     }
//   //   }

//   //   const resetCheckers = () => {
//   //     this.checkerIndex = 0
//   //     this.checkers.length = this.checkerIndex
//   //     web3Provider.getMonitorService().removeListener('network', handleNetwork)
//   //   }

//   //   const runNextChecker = () => {
//   //     if (this.checkerIndex < this.checkers.length) {
//   //       web3Provider.beforeReset()
//   //       web3Provider.afterReset()
//   //       this.checkers[this.checkerIndex]()
//   //       this.checkerIndex++
//   //     } else {
//   //       resetCheckers()
//   //     }
//   //   }

//   //   priority.forEach((providerId) => {
//   //     const networks = getNetworksByProvider(providerId)
//   //     if (preferMainnet) {
//   //       this.checkers.push(() => selectAndResolve(NETWORK_MAIN_ID, providerId))
//   //     } else {
//   //       networks
//   //         .filter((network) => network.id !== NETWORK_MAIN_ID)
//   //         .forEach((network) => {
//   //           this.checkers.push(() => selectAndResolve(network.id, providerId))
//   //         })
//   //     }
//   //   })

//   //   web3Provider.getMonitorService()
//   //     .on('network', handleNetwork)
//   //   runNextChecker()
//   // }

//   // Do need it anymore. Use 'login' from 'core/redux/session/thunks
//   // login (account) {
//   //   this._account = account
//   //   this.emit('login', { account: this._account, dispatch: this._dispatch })
//   // }

// }

// export default new NetworkService()
