import { createSelector } from 'reselect'
import { getTokens } from 'redux/tokens/selectors'
import TokenModel from 'models/tokens/TokenModel'

export const getChronobankTokens = () => createSelector([ getTokens ],
  (tokens) => {
    return tokens.items().filter((token: TokenModel) => token.isERC20(),
    )
  },
)
