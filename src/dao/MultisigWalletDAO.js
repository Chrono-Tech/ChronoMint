import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import TokenModel from 'models/tokens/TokenModel'
import MultisigTransactionModel from 'models/wallet/MultisigTransactionModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import MultisigWalletPendingTxCollection from 'models/wallet/MultisigWalletPendingTxCollection'
import MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'
import { MultiEventsHistoryABI, WalletABI } from './abi'
import contractManagerDAO from './ContractsManagerDAO'

export default class MultisigWalletDAO extends AbstractContractDAO {

  constructor (at) {
    super(WalletABI, at, MultiEventsHistoryABI)
    this._okCodes.push(resultCodes.WALLET_CONFIRMATION_NEEDED)
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

  watchOwnerAdded (wallet, callback) {
    return this._watch('MultisigWalletOwnerAdded', (result) => {
      callback(result.args.newOwner)
    }, { self: wallet.address() })
  }

  watchOwnerRemoved (wallet, callback) {
    return this._watch('MultisigWalletOwnerRemoved', (result) => {
      // TODO @dkchv: if its me - remove wallet!
      callback(result.args.oldOwner)
    }, { self: wallet.address() })
  }

  watchError (wallet, callback) {
    return this._watch('Error', (result) => {
      console.log('--MultisigWalletDAO#', result)
      callback(this._c.hexToDecimal(result.args.errorCode))
      // callback(result.args.errorCode)
    }, { self: wallet.address() })
  }

  async getPendings (tokens) {
    let pendingTxCollection = new MultisigWalletPendingTxCollection()
    const [ to, value, symbol, id, isConfirmed ] = await this._call('getPendings')

    to.forEach((item, i) => {
      let pendingTxModel
      if (this.isEmptyAddress(symbol[i])) {
        // this is transfer
        const symbolString = this._c.bytesToString(symbol[ i ])
        const tokenDAO = tokens.get(symbolString).dao()
        pendingTxModel = new MultisigWalletPendingTxModel({
          to: item,
          value: tokenDAO.removeDecimals(value[ i ]),
          symbol: symbolString,
          id: id[ i ],
          isConfirmed: isConfirmed[ i ],
        })
      } else {
        // this is other confirmations: add/remove owners, etc
        pendingTxModel = new MultisigWalletPendingTxModel({
          id: id[ i ],
          isConfirmed: isConfirmed[ i ],
        })
      }
      pendingTxCollection = pendingTxCollection.add(pendingTxModel)
    })
    return pendingTxCollection
  }

  async getOwners () {
    const counter = await this._callNum('m_numOwners')
    let promises = []
    for (let i = 0; i < counter; i++) {
      promises.push(this._call('getOwner', [ i ]))
    }
    return Promise.all(promises)
  }

  getRequired () {
    return this._callNum('m_required')
  }

  async getTokens () {
    const erc20managerDAO = await contractManagerDAO.getERC20ManagerDAO()
    return erc20managerDAO.getTokensByAddresses([], true, this.getInitAddress())
  }

  async removeWallet (wallet, account: string) {
    const result = await this._tx('kill', [
      account,
    ], {
      address: wallet.address(),
      account,
    })
    return result.tx
  }

  async addOwner (wallet, ownerAddress) {
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
