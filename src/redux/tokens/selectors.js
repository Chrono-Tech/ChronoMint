import { DUCK_TOKENS } from './actions'

// eslint-disable-next-line import/prefer-default-export
export const getTokens = (state) => {
  return state.get(DUCK_TOKENS)
}
