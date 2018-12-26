/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
//
// const bippath = require('bip32-path')
//
// const WAVES_CONFIG = {
//   STATUS: {
//     SW_OK: 0x9000,
//     SW_USER_CANCELLED: 0x9100,
//     SW_CONDITIONS_NOT_SATISFIED: 0x6985,
//     SW_BUFFER_OVERFLOW: 0x6990,
//     SW_INCORRECT_P1_P2: 0x6A86,
//     SW_INS_NOT_SUPPORTED: 0x6D00,
//     SW_CLA_NOT_SUPPORTED: 0x6E00,
//     SW_SECURITY_STATUS_NOT_SATISFIED: 0x6982,
//   },
//   SECRET: 'WAVES',
//   PUBLIC_KEY_LENGTH: 32,
//   ADDRESS_LENGTH: 35,
//   STATUS_LENGTH: 2,
//   SIGNED_CODES: {
//     ORDER: 0xFC,
//     SOME_DATA: 0xFD,
//     REQUEST: 0xFE,
//     MESSAGE: 0xFF,
//   },
//   MAX_SIZE: 128,
//   WAVES_PRECISION: 8,
// }
//
// export function foreach<T, A> (
//   arr: T[],
//   callback: (T, number) => Promise<A>
// ): Promise<A[]> {
//   function iterate (index, array, result) {
//     if (index >= array.length) {
//       return result
//     }
//     return callback(array[index], index).then((res) => {
//       result.push(res)
//       return iterate(index + 1, array, result)
//     })
//   }
//
//   return Promise.resolve().then(() => iterate(0, arr, []))
// }
//
// /**
//  * WAVES API
//  *
//  * @example
//  * import Waves from "@ledgerhq/hw-app-waves"
//  * const waves = new Waves(transport)
//  */
// export default class Waves {
//   transport: Transport<*>
//
//   constructor (transport: Transport<*>, networkCode = 87) {
//     this.transport = transport
//     this.networkCode = networkCode
//     transport.decorateAppAPIMethods(
//       this,
//       [
//         "getWalletPublicKey",
//         "signTransaction",
//         "signMessage",
//         "signSomeData",
//         "signRequest",
//         "signOrder",
//       ],
//       "WAVES_CONFIG.SECRET"
//     )
//   }
//
//   /**
//    * get Waves public key for a given BIP 32 path.
//    * @param path a path in BIP 32 format
//    * @option boolDisplay optionally enable or not the display
//    * @option boolChaincode optionally enable or not the chaincode request
//    * @return an object with a publicKey, address and (optionally) chainCode
//    * @example
//    * eos.getPublicKey("44'/194'/0'/0'/0").then(o => o.address)
//    */
//   async getWalletPublicKey (
//     path: string,
//     verify = false
//   ): Promise<{
//     publicKey: string,
//     address: string,
//     statusCode?: string
//   }> {
//     const paths = bippath.fromString(path).toPathArray()
//     const buffer2 = Buffer.alloc(paths.length * 4)
//     paths.forEach((element, index) => {
//       buffer2.writeUInt32BE(element, 4 * index)
//     })
//
//     const p1 = verify ? 0x80 : 0x00
//     const response2 = await this.transport.send(0x80, 0x06, 0x00, 0x00)
//     const req = Buffer.concat([
//       Buffer.from([0x80, 0x04, 0x00, 0x54]),
//       Buffer.from([buffer2.length]),
//       buffer2,
//     ])
//
//     const response = await this.transport.send(0x80, 0x04, 0x00, 0x54, buffer2)
//
//     const publicKey = libs.base58.encode(response.slice(0, WAVES_CONFIG.PUBLIC_KEY_LENGTH))
//     const address = response
//       .slice(WAVES_CONFIG.PUBLIC_KEY_LENGTH, WAVES_CONFIG.PUBLIC_KEY_LENGTH + WAVES_CONFIG.ADDRESS_LENGTH)
//       .toString("ascii")
//     const statusCode = response
//       .slice(-WAVES_CONFIG.STATUS_LENGTH)
//       .toString("hex")
//     return { publicKey, address, statusCode }
//   }
//
//   /**
//    * You can sign a transaction and retrieve v, r, s given the raw transaction and the BIP 32 path of the account to sign
//    * @example
//    eth.signTransaction("44'/194'/0'/0'/0", "....").then(result => ...)
//    */
//   signTransaction (path, amountPrecission, txData): Promise<string> {
//     const dataForSign = Buffer.concat([
//       Waves.splitPath(path),
//       Buffer.from([
//         amountPrecission,
//         WAVES_CONFIG.WAVES_PRECISION,
//       ]),
//       txData,
//     ])
//
//     return this._signData(dataForSign)
//   }
//
//   async _signData (dataBuffer): Promise<string> {
//     const maxChankLength = WAVES_CONFIG.MAX_SIZE - 5
//     const dataLength = dataBuffer.length
//     let sendBytes = 0
//     let result
//
//     while (dataLength > sendBytes) {
//       const chankLength = Math.min(dataLength - sendBytes, maxChankLength)
//       const isLastByte = (dataLength - sendBytes > maxChankLength) ? 0x00 : 0x80
//       const chainId = isLastByte ? this.networkCode : 0x00
//       const txChank = dataBuffer.slice(sendBytes, chankLength + sendBytes)
//       sendBytes += chankLength
//       result = await this.transport.send(0x80, 0x02, isLastByte, chainId, txChank)
//       const isError = Waves.checkError(result.slice(-2))
//       if (isError) {
//         throw isError
//       }
//     }
//
//     return libs.base58.encode(result.slice(0, -2))
//   }
//
//   static checkError (data): { error: string, status: number } {
//     const statusCode = data[0] * 16 * 16 + data[1]
//     if (statusCode === WAVES_CONFIG.STATUS.SW_OK) {
//       return null
//     }
//     return { error: 'Wrong data', status: statusCode }
//   }
//
//   static splitPath (path) {
//     const result = []
//     path.split("/").forEach((element) => {
//       let number = parseInt(element, 10)
//       if (isNaN(number)) {
//         return
//       }
//
//       if (element.length > 1 && element[element.length - 1] === "'") {
//         number += 0x80000000
//       }
//       result.push(number)
//     })
//
//     const buffer = new Buffer(result.length * 4)
//
//     result.forEach((element, index) => {
//       buffer.writeUInt32LE(element, 4 * index)
//     })
//
//     return buffer
//   }
//
// }
