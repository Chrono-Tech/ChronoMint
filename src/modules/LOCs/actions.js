import { createAction } from 'redux-actions'

const actionCreators = {
  addLOC: createAction('LOC_ADD'),
  updateLOC: createAction('LOC_UPDATE'),
  deleteLOC: createAction('LOC_DELETE')
}

export default actionCreators
