import AbstractContractDAO from './AbstractContractDAO'
import ChronoMintDAO from './ChronoMintDAO'

class TimeDAO extends AbstractContractDAO {
  init = (timeProxyAddress) => {
    return ChronoMintDAO.getAddress().then(address => {
      this.contract.then(deploy => deploy.init(timeProxyAddress, {from: address}))
    })
  };
}

export default new TimeDAO(require('../contracts/ChronoBankAsset.json'))
