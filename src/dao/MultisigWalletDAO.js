import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import contractManagerDAO from './ContractsManagerDAO'
import BigNumber from 'bignumber.js'
import MultisigWalletPendingTxModel from 'models/Wallet/MultisigWalletPendingTxModel'
import TokenModel from 'models/TokenModel'
import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'

const CODE_CONFIRMATION_NEEDED = 4

export default class MultisigWalletDAO extends AbstractMultisigContractDAO {

  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/Wallet.json'),
      at
    )
    this._okCodes = [
      ...this._okCodes,
      CODE_CONFIRMATION_NEEDED
    ]
  }

  watchOwnerRemoved (callback) {
    return this._watch('OwnerRemoved', callback)
  }

  watchConfirmationNeeded (callback) {
    return this._watch('ConfirmationNeeded', (result) => {
      const pendingTx = new MultisigWalletPendingTxModel({
        ...result.args,
        symbol: this._c.bytesToString(result.args.symbol),
      })
      callback(pendingTx)
    })
  }

  watchMultiTransact (callback) {
    return this._watch('MultiTransact', callback)
  }

  watchSingleTransact (callback) {
    return this._watch('SingleTransact', callback)
  }

  watchDeposit (callback) {
    return this._watch('Deposit', result => {
      callback(result.args.value)
    })
  }

  getName () {
    return this._call('name')
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
    const result = await this._multisigTx('kill', [
      account
    ], {
      address: wallet.address(),
      account
    })
    return result.tx
  }

  async addOwner (wallet, newOwner) {
    const result = await this._tx('addOwner', [
      newOwner
    ], {
      wallet: wallet.address(),
      newOwner
    })
    return result.tx
  }

  async transfer (wallet: MultisigWalletModel, token: TokenModel, amount, to) {
    const value = token.dao().addDecimals(new BigNumber(amount))
    const result = await this._tx('transfer', [
      to,
      value,
      token.symbol()
    ], {
      from: wallet.address(),
      to,
      symbol: token.symbol(),
      amount
    })
    return result.tx
  }
}

