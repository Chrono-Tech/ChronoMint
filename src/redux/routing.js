/**
 * A custom router reducer to support an Immutable store.
 * @see https://github.com/gajus/redux-immutable#using-with-react-router-redux
 */
import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = Immutable.fromJS({
  locationBeforeTransitions: null
})

const reducer = (state = initialState, {type, payload}) => {
  if (type === LOCATION_CHANGE) {
    return state.merge({locationBeforeTransitions: payload})
  }
  return state
}

export default reducer
