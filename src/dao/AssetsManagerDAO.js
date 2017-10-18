import AbstractContractDAO from './AbstractContractDAO'

export default class AssetsManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/AssetsManager.json'), at)
  }

  // TODO MINT-230 AssetsManager
}
