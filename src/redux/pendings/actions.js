import {SubmissionError} from 'redux-form'
import UserDAO from '../../dao/UserDAO'
import { hideModal } from '../ui/modal'

const setRequiredSignatures = (required, account) => (dispatch) => {
  return UserDAO.getCBECount().then((r) => {
    if (required > r) {
      throw new SubmissionError({numberOfSignatures: 'Number of signatures must be less then ' + r, _error: 'Error'})
    }
    return UserDAO.setRequiredSignatures(required, account).then(() => {
      dispatch(hideModal())
    })
  })
}

export {
  setRequiredSignatures
}
