import {SubmissionError} from 'redux-form'
import * as actions from '../../../src/redux/pendings/actions'
import UserDAO from '../../../src/dao/UserDAO'
import {store} from '../../init'

const account = UserDAO.web3.eth.accounts[0]

describe('pending actions', () => {
  it('should set required signatures', () => {
    return store.dispatch(actions.setRequiredSignatures(1, account)).then(() => {
      expect(store.getActions()).toContainEqual({type: 'modal/HIDE'})
    })
  })

  it('should Not set required signatures', () => {
    return store.dispatch(actions.setRequiredSignatures(2, account)).then(null, e => {
      expect(e).toEqual(new SubmissionError())
    })
  })
})
