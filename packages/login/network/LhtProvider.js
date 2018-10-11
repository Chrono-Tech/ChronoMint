/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { EthereumProvider } from './EthereumProvider'
import selectLhtNode from './LhtNode'

export const lhtProvider = new EthereumProvider(selectLhtNode)
