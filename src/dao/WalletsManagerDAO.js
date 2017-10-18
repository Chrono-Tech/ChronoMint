import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

export default class WalletsManagerDAO extends AbstractMultisigContractDAO {
  constructor(at) {
    super(
      require('chronobank-smart-contracts/build/contracts/WalletsManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async getWallets() {
    const wallets = await this._call('getWallets')
    // console.log('getWallets, wallets =', wallets)
    return wallets
  }

  async createWallet(walletOwners, requiredSignaturesNum, walletName) {
    const created = await this._tx('createWallet', [walletOwners, requiredSignaturesNum, walletName])
    // console.log('createWallet, created =', created)
    return created
  }
}
