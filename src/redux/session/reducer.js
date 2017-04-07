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
    case a.SESSION_DESTROY: {
      const chronoBankAccount = window.localStorage.getItem('chronoBankAccount')
      const lastUrls = {
        ...JSON.parse(window.localStorage.getItem('lastUrls') || '{}'),
        [chronoBankAccount]: action.lastUrl
      }
      window.localStorage.clear()
      window.localStorage.setItem('lastUrls', JSON.stringify(lastUrls))
      AbstractContractDAO.stopWatching()
      return initialState
    }
    default:
      return state
  }
}
