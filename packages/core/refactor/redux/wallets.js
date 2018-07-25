// import assert from 'assert'
import Accounts from 'web3-eth-accounts'
import uniqid from 'uniqid'
import { remove } from 'lodash'
import { WalletEntryModel, SignerMemoryModel, SignerDeviceModel, SignerPluginModel, WalletModel } from '@laborx/exchange.core'

// Lines below are stubbed for further development.
// Info: Igor, Michail
// import { DEVICES, PLUGINS } from 'src/services'
const DEVICES = {}
const PLUGINS = {}

export const WALLETS_CREATE = 'wallets/create'
export const WALLETS_SELECT = 'wallets/select'
export const WALLETS_UPDATE = 'wallets/update'
export const WALLETS_REMOVE = 'wallets/remove'

export default ({ web3 }) => ({
  namespaced: true,
  state: {
    list: [],
    active: null
  },
  mutations: {
    [WALLETS_SELECT] (state, wallet: WalletModel) {
      state.active = wallet
    },
    [WALLETS_UPDATE] (state, { entry, data }) {
      let foundIndex = state.list.findIndex(wallet => wallet.name === entry.name)
      if (foundIndex !== -1) {
        if ('name' in data) {
          Object.assign(state.list[foundIndex], { name: data.name })
        }
        if ('encrypted' in data) {
          Object.assign(state.list[foundIndex], { encrypted: data.encrypted })
        }
      }
    },
    [WALLETS_CREATE] (state, entry: WalletEntryModel) {
      state.list.push(entry)
    },
    [WALLETS_REMOVE] (state, name: String) {
      remove(state.list, entry => entry.name === name)
      if (state.active && state.active.entry.name === name) {
        state.active = null
      }
    }
  },
  getters: {
    signer: (state) => state.active && state.active.signer,
    active: (state) => state.active
  },
  actions: {
    async changePassword ({ state, dispatch }, { entry, oldPassword, newPassword }) {
      try {
        const accounts = new Accounts()
        accounts.wallet.decrypt(entry.encrypted, oldPassword)
        const keystore = accounts.wallet.encrypt(newPassword)
        await dispatch('updateWallet', { entry, encrypted: keystore })
        // TODO @ipavlenko: Update active wallet
        return true
      } catch (e) {
        return false
      }
    },
    async loadMemoryWallet ({ state, commit }, { entry, password }) {
      const signer = await SignerMemoryModel.decrypt({ web3, entry, password })
      const model = new WalletModel({
        signer,
        entry
      })
      commit(WALLETS_SELECT, model)
      return model
    },
    async loadDeviceWallet ({ state, commit }, { entry }) {
      const signer = await SignerDeviceModel.decrypt({ web3, entry, device: DEVICES[entry.encrypted.device] })
      const model = new WalletModel({
        signer,
        entry
      })
      commit(WALLETS_SELECT, model)
      return model
    },
    async loadPluginWallet ({ state, commit }, { entry }) {
      const signer = await SignerPluginModel.decrypt({ web3, entry, plugin: PLUGINS[entry.encrypted.plugin] })
      const model = new WalletModel({
        signer,
        entry
      })
      commit(WALLETS_SELECT, model)
      return model
    },
    async createWallet ({ state, commit }, { name, password, seed, mnemonic, numbeOfAccounts = 0 }) {
      const signer = await SignerMemoryModel.create({ web3, seed, mnemonic, numbeOfAccounts })
      const entry = new WalletEntryModel({
        key: uniqid(),
        name,
        encrypted: await signer.encrypt(password)
      })
      commit(WALLETS_CREATE, entry)
      return new WalletModel({
        entry,
        signer
      })
    },
    async createDeviceWallet ({ state, commit }, { name, device, address, path, publicKey }) {
      const signer = await SignerDeviceModel.create({ web3, device, address, path, publicKey })
      const entry = new WalletEntryModel({
        key: uniqid(),
        name,
        type: 'device',
        encrypted: await signer.encrypt()
      })
      commit(WALLETS_CREATE, entry)
      return new WalletModel({
        entry,
        signer
      })
    },
    async createPluginWallet ({ state, commit }, { name, plugin, address }) {
      console.log('createPluginWallet', name, address)
      const signer = await SignerPluginModel.create({ web3, plugin, address })
      const entry = new WalletEntryModel({
        key: uniqid(),
        name,
        type: 'plugin',
        encrypted: await signer.encrypt()
      })
      commit(WALLETS_CREATE, entry)
      return new WalletModel({
        entry,
        signer
      })
    },
    async removeWallet ({ state, commit }, name) {
      commit(WALLETS_REMOVE, name)
    },
    async updateWallet ({ state, commit }, { entry, ...data }) {
      commit(WALLETS_UPDATE, { entry, data })
    },
    async logout ({ state, commit, dispatch }) {
      commit(WALLETS_SELECT, null)
      // web3.eth.accounts.wallet.clear()
    }
  }
})
