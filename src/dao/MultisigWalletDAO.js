import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import TokenModel from 'models/TokenModel'
import MultisigTransactionModel from 'models/Wallet/MultisigTransactionModel'
import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import MultisigWalletPendingTxCollection from 'models/Wallet/MultisigWalletPendingTxCollection'
import MultisigWalletPendingTxModel from 'models/Wallet/MultisigWalletPendingTxModel'
import { MultiEventsHistoryABI, WalletABI } from './abi'
import contractManagerDAO from './ContractsManagerDAO'

export default class MultisigWalletDAO extends AbstractContractDAO {

  constructor (at) {
    super(WalletABI, at, MultiEventsHistoryABI)
    this._okCodes.push(resultCodes.WALLET_CONFIRMATION_NEEDED)
  }

  watchOwnerRemoved (wallet, callback) {
    return this._watch('MultisigWalletOwnerRemoved', callback, { self: wallet.address() })
  }

  watchConfirmationNeeded (wallet, callback) {
    return this._watch('MultisigWalletConfirmationNeeded', (result) => {
      const { operation, value, to, symbol } = result.args
      const symbolString = this._c.bytesToString(symbol)
      if (!symbolString) {
        // eslint-disable-next-line
        console.error('symbol not found', symbolString)
        return
      }
      const tokenDAO = wallet.tokens().get(symbolString).dao()
      callback(new MultisigWalletPendingTxModel({
        id: operation,
        value: tokenDAO.removeDecimals(value),
        to,
        symbol: symbolString,
        isConfirmed: true,
      }))
    }, { self: wallet.address() })
  }

  watchMultiTransact (wallet, callback) {
    return this._watch('MultisigWalletMultiTransact', (result) => {
      const { operation, owner, self, symbol, value } = result.args
      const symbolString = this._c.bytesToString(symbol)
      const token = wallet.tokens().get(symbolString)
      callback(new MultisigTransactionModel({
        id: operation,
        owner,
        wallet: self,
        symbol: symbolString,
        value: token.dao().removeDecimals(value),
      }))
    }, { self: wallet.address() })
  }

  watchSingleTransact (wallet, callback) {
    return this._watch('MultisigWalletSingleTransact', callback, { self: wallet.address() })
  }

  watchDeposit (wallet, callback) {
    return this._watch('MultisigWalletDeposit', (result) => {
      callback(wallet.tokens().get('ETH').dao().removeDecimals(result.args.value))
    }, { self: wallet.address() })
  }

  watchRevoke (wallet, callback) {
    return this._watch('MultisigWalletRevoke', (result) => {
      callback(result.args.operation)
    }, { self: wallet.address() })
  }

  watchConfirmation (wallet, callback) {
    return this._watch('MultisigWalletConfirmation', (result) => {
      // TODO @dkchv: something wrong with contract
      if (result.args.owner === '0x') {
        return
      }
      callback(result.args.operation, result.args.owner)
    }, { self: wallet.address() })
  }

  async getPendings (tokens) {
    let pendingTxCollection = new MultisigWalletPendingTxCollection()
    const [to, value, symbol, id, isConfirmed] = await this._call('getPendings')

    to.forEach((item, i) => {
      const symbolString = this._c.bytesToString(symbol[i])
      if (!symbolString) {
        // TODO @dkchv: something wrong in contract
        return
      }
      const tokenDAO = tokens.get(symbolString).dao()
      pendingTxCollection = pendingTxCollection.add(new MultisigWalletPendingTxModel({
        to: item,
        value: tokenDAO.removeDecimals(value[i]),
        symbol: symbolString,
        id: id[i],
        isConfirmed: isConfirmed[i],
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

  async addOwner (wallet, ownerAddress) {
    console.log('--MultisigWalletDAO#addOwner', this)
    const result = await this._tx('addOwner', [
      ownerAddress,
    ], {
      wallet: wallet.address(),
      ownerAddress,
    })
    return result.tx
  }

  async removeOwner (wallet, ownerAddress) {
    const result = await this._tx('removeOwner', [
      ownerAddress,
    ], {
      wallet: wallet.address(),
      ownerAddress,
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
