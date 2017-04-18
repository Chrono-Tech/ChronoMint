import {SubmissionError} from 'redux-form'
import * as actions from '../../../src/redux/pendings/actions'
import {store} from '../../init'
import web3Provider from '../../../src/network/Web3Provider'

const account = web3Provider.getWeb3instance().eth.accounts[0]

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
