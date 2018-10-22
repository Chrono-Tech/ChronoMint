/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const estimateEthTxGas = (web3, tx, gasPrice, nonce, chainId) =>
  web3.eth.estimateGas({
    from: tx.from,
    to: tx.to,
    gasPrice,
    value: tx.value,
    data: tx.data,
    nonce,
    chainId,
  })
