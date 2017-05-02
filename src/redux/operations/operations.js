import { Map } from 'immutable'
// import OperationsDAO from '../../dao/OperationsDAO'

// export const OPERATIONS_LIST_FETCH = 'operations/LIST_FETCH'
// export const OPERATIONS_LIST = 'operations/LIST'

const initialState = {
  list: new Map()
}

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

// const listOperations = () => dispatch => {
//   dispatch({type: OPERATIONS_LIST_FETCH})
//   return OperationsDAO.getList().then(list => {
//     dispatch({type: OPERATIONS_LIST, list})
//   })
// }
