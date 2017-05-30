import AbstractContractDAO from './AbstractContractDAO'
import ERC20DAO from './ERC20DAO'

export default class ERC20ManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/ERC20Manager.json'), at)
  }

  async initTokenMetaData (dao: ERC20DAO) {
    const address = await dao.getAddress()
    const data = await this._call('getTokenMetaData', [address])
    dao.setDecimals(data[4].toNumber())
    dao.initialized()
  }
}
