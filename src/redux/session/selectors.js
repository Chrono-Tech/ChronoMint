import { createSelector } from 'reselect'
import { isTokenChecked } from 'models/ProfileModel'
import { MANDATORY_TOKENS } from 'dao/ERC20ManagerDAO'
import { DUCK_SESSION } from './actions'
import { getCurrentWallet } from '../wallet/actions'
import { getTokens } from '../tokens/selectors'

export const getProfile = (state) => {
  const { profile } = state.get(DUCK_SESSION)
  return profile
}

// Permanent reference to a functor to improve selector performance
export const BALANCES_COMPARATOR_SYMBOL = (balance) => balance.symbol()

export const getVisibleBalances = (comparator = null) => createSelector(
  [getCurrentWallet, getProfile, getTokens],
  (wallet, profile, tokens) => {
    const ordered = comparator
      ? wallet.balances().sortBy(comparator)
      : wallet.balances().items()
    return ordered.filter((balance) => {
      const token = tokens.item(balance.symbol())
      let profileToken
      profile.tokens().map((item) => {
        if (token && isTokenChecked(token, item)) {
          profileToken = item
        }
      })
      if (MANDATORY_TOKENS.includes(token.symbol())) {
        return true
      }

      return profileToken ? profileToken.show : !token.isOptional()
    })
  }
)
