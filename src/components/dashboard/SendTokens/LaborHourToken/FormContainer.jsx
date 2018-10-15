/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { LHT } from '@chronobank/core/dao/constants'

import FormContainer from '../EthereumLikeBlockchain/FormContainer'

const lhtFormContainer = (props) => (
  <FormContainer {...props} symbol={LHT} />
)

export default lhtFormContainer
