import { handleActions } from 'redux-actions'
import _ from 'lodash'

const transformAccounts = (accounts) => {
  return accounts.map(a => {
    return Object.assign({}, a, {
      totalExposure: _.sum([a.balance, a.arrears, a.charges])
    })})
}

const calcTotals = (accounts) => {
  const balance = _.sumBy(accounts, 'balance')
  const instalment = _.sumBy(accounts, 'instalment')
  const collateral = _.sumBy(accounts, 'collateral')
  const arrears = _.sumBy(accounts, 'arrears')
  const charges = _.sumBy(accounts, 'charges')
  const totalDebt = _.add( balance, arrears, charges )
  const totalExposure = _.sumBy(accounts, 'totalExposure')
  return {
    balance,
    collateral,
    instalment,
    arrears,
    charges,
    totalDebt,
    totalExposure
  }
}

const accountsResult = (accounts, state = {}) => {
  const transformedAccs = transformAccounts(accounts)
  return {
    ...state,
    accounts: transformedAccs,
    total: calcTotals(transformedAccs)
  }
}

const initialState = ()  => {
  return {
    submitting: false
  }
}

const reducer = handleActions({

  'LOC_ADD': (state, action) => {
    return accountsResult(accounts, state)
  },
  'LOC_UPDATE': (state, action) => {
    return accountsResult(accounts, state)
  },
  'LOC_DELETE': (state, action) => {
    return accountsResult(accounts, state)
  }

}, initialState())

export default reducer
