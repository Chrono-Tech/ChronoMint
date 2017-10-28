import BigNumber from 'bignumber.js'
import MultisigWalletPendingTxModel from 'models/Wallet/MultisigWalletPendingTxModel'
import TokenModel from 'models/TokenModel'
import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import contractManagerDAO from './ContractsManagerDAO'
import MultisigWalletPendingTxCollection from 'models/Wallet/MultisigWalletPendingTxCollection'

const CODE_CONFIRMATION_NEEDED = 14014

export default class MultisigWalletDAO extends AbstractMultisigContractDAO {

  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/Wallet.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json'),
    )
    this._okCodes.push(CODE_CONFIRMATION_NEEDED)
  }

  watchOwnerRemoved (wallet, callback) {
    return this._watch('MultisigWalletOwnerRemoved', callback, { self: wallet.address() })
  }

  watchConfirmationNeeded (wallet, callback) {
    return this._watch('MultisigWalletConfirmationNeeded', result => {
      const {operation, value, to, symbol} = result.args
      const symbolString = this._c.bytesToString(symbol)
      const tokenDAO = wallet.tokens().get(symbolString).dao()
      callback(new MultisigWalletPendingTxModel({
        id: operation,
        value: tokenDAO.removeDecimals(value),
        to,
        symbol: symbolString,
        isSigned: true,
      }))
    }, { self: wallet.address() })
  }

  watchMultiTransact (wallet, callback) {
    return this._watch('MultisigWalletMultiTransact', callback, { self: wallet.address() })
  }

  watchSingleTransact (wallet, callback) {
    return this._watch('MultisigWalletSingleTransact', callback, { self: wallet.address() })
  }

  watchDeposit (wallet, callback) {
    return this._watch('MultisigWalletDeposit', result => {
      callback(wallet.tokens().get('ETH').dao().removeDecimals(result.args.value))
    }, { self: wallet.address() })
  }

  watchRevoke (wallet, callback) {
    return this._watch('MultisigWalletRevoke', result => {
      callback(result.args.operation)
    }, { self: wallet.address() })
  }

  watchConfirmation (wallet, callback) {
    return this._watch('MultisigWalletConfirmation', result => {
      // TODO @dkchv: something wrong with contract
      if (result.args.owner === '0x') {
        return
      }
      callback(result.args.operation, result.args.owner)
    }, { self: wallet.address() })
  }

  async getPendings (tokens) {
    let pendingTxCollection = new MultisigWalletPendingTxCollection()
    const [to, value, symbol, id] = await this._call('getPendings')

    to.forEach((item, i) => {
      const symbolString = this._c.bytesToString(symbol[i])
      const tokenDAO = tokens.get(symbolString).dao()
      pendingTxCollection = pendingTxCollection.add(new MultisigWalletPendingTxModel({
        to: item,
        value: tokenDAO.removeDecimals(value[i]),
        symbol: symbolString,
        id: id[i],
      }))
    })
    return pendingTxCollection
  }

  async getOwners () {
    const counter = await this._callNum('m_numOwners')
    let promises = []
    for (let i = 0; i < counter; i++) {
      promises.push(this._call('getOwner', [i]))
    }
    return Promise.all(promises)
  }

  getRequired () {
    return this._callNum('m_required')
  }

  async getTokens () {
    const addresses = await this._call('getTokenAddresses')
    const erc20managerDAO = await contractManagerDAO.getERC20ManagerDAO()
    return erc20managerDAO.getTokensByAddresses(addresses, true, this.getInitAddress())
  }

  async removeWallet (wallet, account: string) {
    const result = await this._tx('removeWallet', [
      account,
    ], {
      address: wallet.address(),
      account,
    })
    return result.tx
  }

  async addOwner (wallet, newOwner) {
    const result = await this._tx('addOwner', [
      newOwner,
    ], {
      wallet: wallet.address(),
      newOwner,
    })
    return result.tx
  }

  async transfer (wallet: MultisigWalletModel, token: TokenModel, amount, to) {
    const value = token.dao().addDecimals(new BigNumber(amount))
    const result = await this._tx('transfer', [
      to,
      value,
      token.symbol(),
    ], {
      from: wallet.address(),
      to,
      symbol: token.symbol(),
      amount,
    })
    return result.tx
  }

  async confirmPendingTx (tx) {
    const result = await this._tx('confirm', [
      tx.id(),
    ])
    return result.tx
  }

  async revokePendingTx (tx) {
    const result = await this._tx('revoke', [
      tx.id(),
    ], tx.txRevokeSummary())
    return result.tx
  }
}
