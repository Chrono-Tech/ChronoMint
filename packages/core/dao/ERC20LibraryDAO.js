/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContract3DAO'

export default class ERC20LibraryDAO extends AbstractContractDAO {
  constructor (address, abi) {
    super(address, abi)
  }

  async getContracts () {
    return this.contract.methods.getContracts().call()
  }
}
