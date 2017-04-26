import {SubmissionError} from 'redux-form'
import * as actions from '../../../src/redux/pendings/actions'
import {store} from '../../init'
import web3Provider from '../../../src/network/Web3Provider'

let account

describe('pending actions', () => {
  beforeAll(done => {
    web3Provider.getWeb3().then(web3 => {
      account = web3.eth.accounts[0]
      done()
    })
  })

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
