import AbstractContractDAO from './AbstractContractDAO'

export const TX_CLAIM_CONTRACT_OWNERSHIP = 'claimContractOwnership'
export default class OwnedInterfaceDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/OwnedInterface.json'), at)
  }

  async claimContractOwnership () {
    return await this._tx(TX_CLAIM_CONTRACT_OWNERSHIP)
  }
}
