import AbstractContractDAO from './AbstractContractDAO'
import ChronoMintDAO from './ChronoMintDAO'

class TIMEDAO extends AbstractContractDAO {
  init (timeProxyAddress) {
    return ChronoMintDAO.getAddress().then(address => {
      this.contract.then(deploy => deploy.init(timeProxyAddress, {from: address}))
    })
  }
}

export default new TIMEDAO(require('../contracts/ChronoBankAsset.json'))
