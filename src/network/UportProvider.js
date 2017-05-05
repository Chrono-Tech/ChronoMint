import { Connect, QRUtil } from 'uport-connect'
import { decode, isMNID } from 'mnid'
import { INFURA_TOKEN, UPORT_ID } from './settings'

const customOpenQr = (data, cancel) => {
  console.log('--UportProvider#customOpenQr', data)
  QRUtil.openQr(data, cancel)
}

export const decodeMNIDaddress = (mnidAddress) => {
  return isMNID(mnidAddress) ? decode(mnidAddress) : 'null'
}

const uportProvider = new Connect('ChronoBankTest', {
  uriHandler: customOpenQr,
  infuraApiKey: INFURA_TOKEN,
  closeUriHandler: QRUtil.closeQr,
  clientId: UPORT_ID
})

export default uportProvider
