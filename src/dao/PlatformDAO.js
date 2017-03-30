import AbstractContractDAO from './AbstractContractDAO'
import ChronoMintDAO from './ChronoMintDAO'
import EventHistoryDAO from './EventHistoryDAO'

class PlatformDAO extends AbstractContractDAO {
  setupEventsHistory () {
    return Promise.all(EventHistoryDAO.getAddress(), ChronoMintDAO.getAddress())
      .then(res => {
        this.contract.then(deployed => {
          deployed.setupEventsHistory(res[0], {from: res[1]})
        })
      })
  };

  issueAsset (symbol, value, name, description, baseUnit, isReusable) {
    return this.contract.then(deployed => {
      ChronoMintDAO.getAddress().then(mintAddress => {
        deployed.issueAsset(symbol, value, name, description, baseUnit, isReusable, {
          from: mintAddress,
          gas: 3000000
        })
      })
    })
  };

  setProxy (address, symbol) {
    return ChronoMintDAO.getAddress().then(mintAddress => {
      this.contract.then(deployed => {
        deployed.setProxy(address, symbol, {from: mintAddress})
      })
    })
  };

  getHoldersCount () {
    return this.contract.then(deployed => {
      return deployed.holdersCount.call().then(value => value.toNumber())
    })
  };
}

export default new PlatformDAO(require('../contracts/ChronoBankPlatform.json'))
