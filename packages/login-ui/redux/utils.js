import { getNetworkById, getNetworksSelectorGroup } from '@chronobank/login/network/settings'
import web3Factory from '@chronobank/core/web3'

const check = async (network) => {
  const w3 = web3Factory(network)
  try{
    return await w3.eth.net.isListening()
  } catch(e){
   return false
  }
}

 export async function findProvider (providersList){
  let num = 0
  while (providersList[num]) {
    const netData = {
      selectedNetworkId: providersList[num].network.id,
      selectedProviderId: providersList[num].provider.id,
    }
    const network = getNetworkById(netData.selectedNetworkId, netData.selectedProviderId)

    if (await check(network)) return netData
    num++
  }
  return null
}

export async function checkNetwork (selectedNetworkId, selectedProviderId) {
  let providersList = getNetworksSelectorGroup()

  let network = getNetworkById(selectedNetworkId, selectedProviderId)
  if(await check(network)) return null
  for (let i in providersList) {
    const level = providersList[i]
    for (let k in level.providers) {
      let net = level.providers[k]
      if (
        net.network.id === selectedNetworkId &&
        net.provider.id === selectedProviderId
      ) {
        let providers = level.providers.filter(net => !(net.network.id === selectedNetworkId &&
          net.provider.id === selectedProviderId))
        return await findProvider(providers)
      }
    }
  }
  return await findProvider(providersList[0].providers)
}