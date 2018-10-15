/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import WavesMemoryDevice from './WavesMemoryDevice'

export const MOCK_PRIVATE_SEED = 'cfc237b5d387c438cfdf647f686807ade5d6284cc7302d1ba5e4dd7e16b4e91b'

export default class WavesLedgerDevice extends WavesMemoryDevice {
  constructor ({ network }) {
    super({ network, seedPhrase: MOCK_PRIVATE_SEED })
  }
}
