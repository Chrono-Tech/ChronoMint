import { List } from 'immutable'
import LHTProxyDAO from '../../dao/LHTProxyDAO'
import LS from '../../utils/LocalStorage'

export const LH_STORY_LIST = 'lhStory/LIST'
export const LH_STORY_LIST_FETCH = 'lhStory/LIST_FETCH'

const initialState = {
  list: new List(),
  isFetching: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LH_STORY_LIST:
      return {
        ...state,
        list: action.transactions,
        isFetching: false
      }
    case LH_STORY_LIST_FETCH:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}

const getStoryList = () => (dispatch) => {
  dispatch({type: LH_STORY_LIST_FETCH})
  LHTProxyDAO.getTransfer(LS.getAccount(),).then((transactions) => {
    dispatch({type: LH_STORY_LIST, transactions})
  })
}

export {
  getStoryList
}

export default reducer
