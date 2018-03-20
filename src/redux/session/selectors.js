import { createSelector } from 'reselect'
import { isTokenChecked } from 'models/ProfileModel'
import { MANDATORY_TOKENS, PROFILE_PANEL_TOKENS } from 'dao/ERC20ManagerDAO' 
import { DUCK_SESSION, rebuildProfileTokens } from './actions'
import { getCurrentWallet } from '../wallet/actions'
import { getMainWallet } from '../wallet/selectors'
import { getTokens } from '../tokens/selectors'

export const getProfile = (state) => {
  const { profile } = state.get(DUCK_SESSION)
  return profile
}

export const getGasSliderCollection = (state) => {
  const { gasPriceMultiplier } = state.get(DUCK_SESSION)
  return gasPriceMultiplier
}

export const getGasPriceMultiplier = (blockchain) => createSelector([ getGasSliderCollection ],
  (gasSliderCollection) => {
    return gasSliderCollection.get(blockchain) || 1
  },
)

// Permanent reference to a functor to improve selector performance
export const BALANCES_COMPARATOR_SYMBOL = (item1, item2) => {
  const s1 = item1.balance.symbol()
  const s2 = item2.balance.symbol()
  return s1 < s2 ? -1 : (s1 > s2 ? 1 : 0)
}
export const BALANCES_COMPARATOR_URGENCY = (item1, item2) => {
  const m1 = MANDATORY_TOKENS.includes(item1.token.symbol())
  const m2 = MANDATORY_TOKENS.includes(item2.token.symbol())
  const urgency = m2 - m1
  if (urgency !== 0) {
    return urgency
  }
  const s1 = item1.balance.symbol()
  const s2 = item2.balance.symbol()
  return s1 < s2 ? -1 : (s1 > s2 ? 1 : 0)
}

export const getProfileTokensList = () => createSelector(
  [ getMainWallet ],
  (mainWallet) => {
    const addressesInWallet = mainWallet.addresses()
    return PROFILE_PANEL_TOKENS
      .map((token) => {
        return { ...token,
          address: addressesInWallet.item(token.blockchain).address(),
        }
      })
  }
)

export const getVisibleBalances = (comparator = BALANCES_COMPARATOR_URGENCY) => createSelector(
  [ getCurrentWallet, getProfile, getTokens ],
  (wallet, profile, tokens) => {
    const profileTokens = rebuildProfileTokens(profile, tokens)
    return wallet.balances().items()
      .map((balance) => ({
        balance,
        token: tokens.item(balance.symbol()),
      }))
      .filter(({
        token,
      }) => {
        if (!token) {
          return false
        }
        let profileToken
        profileTokens.map((item) => {
          if (isTokenChecked(token, item)) {
            profileToken = item
          }
        })
        if (MANDATORY_TOKENS.includes(token.symbol())) {
          return true
        }
        return profileToken ? profileToken.show : !token.isOptional()
      })
      .sort(comparator)
      .map(({
        balance,
      }) => balance)
  },
)

export const getProfileTokens = () => createSelector([getProfile, getTokens],
  (profile, tokens) => {
    return rebuildProfileTokens(profile, tokens)
  },
)
