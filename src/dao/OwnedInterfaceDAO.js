import AbstractContractDAO from './AbstractContractDAO'

export default class OwnedInterfaceDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/OwnedInterface.json'), at)
  }

  async claimContractOwnership () {
    const tx = await this._tx('claimContractOwnership')
    return tx
  }
}
