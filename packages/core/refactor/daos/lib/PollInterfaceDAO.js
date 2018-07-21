/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { PollInterfaceABI } from '../../../../core/dao/abi'
import AbstractContractDAO from './AbstractContractDAO'

export default class PollInterfaceDAO extends AbstractContractDAO {
  constructor ({ address, history }) {
    super({ address, history, abi: PollInterfaceABI })
  }

}
