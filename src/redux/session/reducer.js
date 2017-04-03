import * as a from './actions'
import AbstractContractDAO from '../../dao/AbstractContractDAO'
import UserModel from '../../models/UserModel'

const initialState = {
  account: null,
  profile: new UserModel(),
  isCBE: false,
  isFetching: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.SESSION_CREATE_START:
      return {
        ...state,
        isFetching: true
      }
    case a.SESSION_CREATE_SUCCESS:
      const {account, isCBE} = action
      window.localStorage.setItem('chronoBankAccount', account)
      return {
        ...state,
        account,
        isCBE,
        isFetching: false
      }
    case a.SESSION_PROFILE:
      return {
        ...state,
        profile: action.profile
      }
    case a.SESSION_DESTROY:
      window.localStorage.clear()
      window.localStorage.setItem('next', action.next)
      AbstractContractDAO.stopWatching()
      return initialState
    default:
      return state
  }
}
