import { Connect, QRUtil } from 'uport-connect'
import { decode, isMNID } from 'mnid'
import { INFURA_TOKEN, UPORT_ID } from './settings'

export type UPortAddress = {
  address: string,
  network: string
}

const customOpenQr = (data, cancel) => {
  QRUtil.openQr(data, cancel)
}

export const decodeMNIDaddress = (mnidAddress) => isMNID(mnidAddress) ? decode(mnidAddress) : 'null'

const uportProvider = new Connect('ChronoBankTest', {
  uriHandler: customOpenQr,
  infuraApiKey: INFURA_TOKEN,
  closeUriHandler: QRUtil.closeQr,
  clientId: UPORT_ID,
})

export default uportProvider
