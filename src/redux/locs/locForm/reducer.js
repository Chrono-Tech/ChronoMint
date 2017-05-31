import LOCModel from '../../../models/LOCModel'
import * as actions from './actions'

export default (state = null, action) => {
  switch (action.type) {
    case actions.LOC_FORM_STORE:
      return action.payload || new LOCModel()
    case actions.LOC_FORM_SUBMIT_START:
      return new LOCModel({isSubmitting: true})
    case actions.LOC_FORM_SUBMIT_END:
      return new LOCModel({isSubmitting: false})
    default:
      return state
  }
}
