import { decode, isMNID } from 'mnid'
import { Connect, QRUtil } from 'uport-connect'

import { INFURA_TOKEN, UPORT_ID } from './settings'

export type UPortAddress = {
  address: string,
  network: string
}

class UportProvider {
  constructor () {
    this._uportProvider = new Connect('ChronoBankTest', {
      uriHandler: this._customOpenQr,
      infuraApiKey: INFURA_TOKEN,
      closeUriHandler: QRUtil.closeQr,
      clientId: UPORT_ID,
    })
  }

  getUportProvider () {
    return this._uportProvider
  }

  static _customOpenQr (data, cancel) {
    QRUtil.openQr(data, cancel)
  }

  decodeMNIDaddress (mnidAddress) {
    return isMNID(mnidAddress) ? decode(mnidAddress) : 'null'
  }
}

export default new UportProvider()
