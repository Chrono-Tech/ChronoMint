import Immutable from 'immutable'
import ContractsManagerDAO from '../../../dao/ContractsManagerDAO'

export const TOKENS_LIST = 'settings/TOKENS_LIST'

const initialState = {
  list: new Immutable.Map(), /** @see TokenModel */
  isFetched: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOKENS_LIST:
      return {
        ...state,
        list: action.list,
        isFetched: true
      }
    default:
      return state
  }
}

export const listTokens = () => async (dispatch) => {
  const dao = await ContractsManagerDAO.getERC20ManagerDAO()
  const list = await dao.getTokens(false, false)
  dispatch({type: TOKENS_LIST, list})
}
