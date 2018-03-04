import axios from 'axios'
import networkService from '@chronobank/login/network/NetworkService'
import { NETWORK_MAIN_ID, MIDDLEWARE_MAP, LOCAL_ID } from './settings'

class AssetManagerProvider {

  url () {
    const { network } = networkService.getProviderSettings()

    switch (network.id) {
      case NETWORK_MAIN_ID:
        return MIDDLEWARE_MAP.eth.mainnet
      case LOCAL_ID:
        return MIDDLEWARE_MAP.eth.local
      default:
        return MIDDLEWARE_MAP.eth.testnet
    }
  }

  async getParticipatingPlatformsForUser (userAddress: string) {
    const response = await axios.get(`${this.url()}events/PlatformRequested/?by='${userAddress}'`)

    if (response && response.data.length) {
      return response.data.map((p) => {
        return { address: p.platform, name: null }
      })
    }

    return []
  }

}

export default new AssetManagerProvider()
