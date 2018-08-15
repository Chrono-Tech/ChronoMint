/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { browserHistory, createMemoryHistory } from 'react-router'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'

const historyEngine = process.env.NODE_ENV === 'standalone'
  ? createMemoryHistory()
  : browserHistory

// Create enhanced history object for router
const createSelectLocationState = () => {
  let prevRoutingState
  let prevRoutingStateJS
  return (state) => {
    const routingState = state.get('routing') // or state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

const createHistory = (store) => syncHistoryWithStore(
  historyEngine,
  store,
  { selectLocationState: createSelectLocationState() }
)

export const historyMiddleware = routerMiddleware(historyEngine)
export default createHistory
