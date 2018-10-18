/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import PropTypes from 'prop-types'
import AbstractModel from './AbstractModel'
import AllowanceModel from './wallet/AllowanceModel'

/*{
     "logIndex": 2,
     "transactionIndex": 0,
     "transactionHash": "0x7a2dc0b48401602402ce983de3ee11b3b0a086f1502820d4f2a9662be2def769",
     "blockHash": "0x0b49995a92a942fae97888057402824767a9f52846befd75bc8b0e89119eea97",
     "blockNumber": 93,
     "address": "0x026966e8dc231101C4B462EFedc9348eF7d25ee1",
     "type": "mined",
     "id": "log_9da25a30",
     "returnValues": {
       "0": "0x336c71627573356a6b656a6e656a647478330000000000000000000000000000",
       "1": "0x294f3c4670a56441F3133835A5CBB8BAaf010f88",
       "2": "0x1ace887ff72b66cf8b4292008ba3bcf0ad839108e6b30aba933b2f4dd120e708",
       "_swapID": "0x336c71627573356a6b656a6e656a647478330000000000000000000000000000",
       "_withdrawTrader": "0x294f3c4670a56441F3133835A5CBB8BAaf010f88",
       "_secretLock": "0x1ace887ff72b66cf8b4292008ba3bcf0ad839108e6b30aba933b2f4dd120e708",
     },
     "event": "Open",
     "signature": "0x6ed79a08bf5c8a7d4a330df315e4ac386627ecafbe5d2bfd6654237d967b24f3",
     "raw": {
       "data": "0x336c71627573356a6b656a6e656a647478330000000000000000000000000000000000000000000000000000294f3c4670a56441f3133835a5cbb8baaf010f881ace887ff72b66cf8b4292008ba3bcf0ad839108e6b30aba933b2f4dd120e708",
       "topics": ["0x6ed79a08bf5c8a7d4a330df315e4ac386627ecafbe5d2bfd6654237d967b24f3"],
     },
   }*/
const schemaFactory = () => ({
  key: PropTypes.string,
  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool,
  list: PropTypes.objectOf(PropTypes.instanceOf(AllowanceModel)),
})

export default class AllowanceCollection extends AbstractModel {
  constructor (data, options) {
    super(Object.assign({
      key: uuid(),
      isLoading: false,
      isLoaded: false,
      list: {},
    }, data), schemaFactory(), options)
    Object.freeze(this)
  }
}
