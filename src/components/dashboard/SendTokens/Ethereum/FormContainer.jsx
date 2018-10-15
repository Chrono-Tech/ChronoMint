/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { ETH } from '@chronobank/core/dao/constants'

import FormContainer from '../EthereumLikeBlockchain/FormContainer'

const ethereumFormContainer = (props) => (
  <FormContainer {...props} symbol={ETH} />
)

export default ethereumFormContainer
