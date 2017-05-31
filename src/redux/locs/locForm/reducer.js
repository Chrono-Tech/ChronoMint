import LOCModel from '../../../models/LOCModel'

export const LOC_FORM_STORE = 'locForm/STORE'
export const LOC_FORM_SUBMIT_START = 'locForm/SUBMIT_START'
export const LOC_FORM_SUBMIT_END = 'locForm/SUBMIT_END'

export default (state = null, action) => {
  switch (action.type) {
    case LOC_FORM_STORE:
      return action.payload || new LOCModel()
    case LOC_FORM_SUBMIT_START:
      return new LOCModel({isSubmitting: true})
    case LOC_FORM_SUBMIT_END:
      return new LOCModel({isSubmitting: false})
    default:
      return state
  }
}
