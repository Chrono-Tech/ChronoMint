/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContractDAO'

export default class AssetManagerLibraryDAO extends AbstractContractDAO {
  constructor (address, abi) {
    super(address, abi)
  }

  async getContracts () {
    return this.contract.methods.getContracts().call()
  }
}
