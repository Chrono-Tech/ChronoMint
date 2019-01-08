import { getNetworkById, getNetworksSelectorGroup } from '@chronobank/login/network/settings'

const condition = data => data < 500

 export async function findProvider (providersList){
  let num = 0
  while (providersList[num]) {
    const netData = {
      selectedNetworkId: providersList[num].network.id,
      selectedProviderId: providersList[num].provider.id,
    }
    let network = getNetworkById(netData.selectedNetworkId, netData.selectedProviderId)
    let res = await fetch(`${network.protocol}://${network.host}`)
    if (condition(res.status)) return netData
    num++
  }
  return null
}

export async function checkNetwork (selectedNetworkId, selectedProviderId) {
  let providersList = getNetworksSelectorGroup()

  let network = getNetworkById(selectedNetworkId, selectedProviderId)
  const res = await fetch(`${network.protocol}://${network.host}`)
  if(condition(res.status)) return null
  for (let i in providersList) {
    const level = providersList[i]
    for (let k in level.providers) {
      let net = level.providers[k]
      if (
        net.network.id === selectedNetworkId &&
        net.provider.id === selectedProviderId
      ) {
        delete level.providers[k]
        return await findProvider(level.providers)
      }
    }
  }
  return await findProvider(providersList[0].providers)
}