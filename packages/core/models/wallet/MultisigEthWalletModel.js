/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import MultisigEthLikeWalletModel from './MultisigEthLikeWalletModel'
import { BLOCKCHAIN_ETHEREUM } from '../../dao/constants'

export default class MultisigEthWalletModel extends MultisigEthLikeWalletModel {
  constructor (ownProps) {
    super(ownProps, BLOCKCHAIN_ETHEREUM)
  }
}
