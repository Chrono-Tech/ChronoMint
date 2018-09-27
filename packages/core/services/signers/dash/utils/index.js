/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import { Address, Networks, PrivateKey, PublicKey } from 'dashcore-lib'

export function getAddressByPrivateKey (privateKey, network) {
  const networkType = network === bitcoin.networks.dashcore_testnet ? Networks.testnet : Networks.livenet;
  return new Address(PublicKey(new PrivateKey(privateKey)), networkType).toString();
}
