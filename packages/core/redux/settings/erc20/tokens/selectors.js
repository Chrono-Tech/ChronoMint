/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getTokens } from '../../../tokens/selectors'
import TokenModel from '../../../../models/tokens/TokenModel'

export const getChronobankTokens = () => createSelector([ getTokens ],
  (tokens) => {
    return tokens.items().filter((token: TokenModel) => token.isERC20(),
    )
  },
)
