/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { abstractModel } from '../AbstractModelOld'

class MultisigTransactionModel extends abstractModel({
  id: null, // operation hash
  owner: null,
  wallet: null,
  symbol: null,
  value: new BigNumber(0),
  to: null,
  data: null,
}) {
  id () {
    return this.get('id') || Math.random()
  }

  value () {
    return this.get('value')
  }

  symbol () {
    return this.get('symbol')
  }

  wallet () {
    return this.get('wallet')
  }

  data () {
    return this.get('data')
  }
}

export default MultisigTransactionModel
