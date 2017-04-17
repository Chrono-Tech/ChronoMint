import LOCModel from '../../models/LOCModel'

const LOC_FORM_STORE = 'locForm/STORE'
const LOC_FORM_SUBMIT_START = 'locForm/SUBMIT_START'
const LOC_FORM_SUBMIT_END = 'locForm/SUBMIT_END'

const reducer = (state = null, action) => {
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

const storeLOCAction = payload => ({type: LOC_FORM_STORE, payload})

export {
  storeLOCAction,
  LOC_FORM_SUBMIT_START,
  LOC_FORM_SUBMIT_END
}
export default reducer
