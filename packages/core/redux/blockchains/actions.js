/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAINS_LIST_UPDATE } from './constants'

/* eslint-disable-next-line import/prefer-default-export */
export const updateBlockchainsList = (blockchainsList) => ({
  type: BLOCKCHAINS_LIST_UPDATE,
  blockchainsList,
})
