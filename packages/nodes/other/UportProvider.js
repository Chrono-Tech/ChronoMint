/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { decode, isMNID } from 'mnid'
import { Connect, QRUtil } from 'uport-connect'

export const INFURA_TOKEN = 'PVe9zSjxTKIP3eAuAHFA'
export const UPORT_ID = '0xfbbf28aaba3b2fc6dfe1a02b9833ccc90b8c4d26'

class UportProvider {
  constructor () {
    this._uportProvider = new Connect('ChronoBankTest', {
      uriHandler: this._customOpenQr,
      infuraApiKey: INFURA_TOKEN,
      closeUriHandler: QRUtil.closeQr,
      clientId: UPORT_ID,
    })
  }

  static _customOpenQr (data, cancel) {
    QRUtil.openQr(data, cancel)
  }

  getUportProvider = () => this._uportProvider

  decodeMNIDaddress = (mnidAddress) =>
    isMNID(mnidAddress)
      ? decode(mnidAddress)
      : 'null'
}

export default new UportProvider()
