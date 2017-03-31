import * as actions from '../../../src/redux/pendings/actions'
import UserDAO from '../../../src/dao/UserDAO'
import {store} from '../../init'
import {PENDING_UPDATE_PROPS} from '../../../src/redux/pendings/operationsProps/reducer'

const account = UserDAO.web3.eth.accounts[0]

describe('pendings actions', () => {
  it('should set required signatures', () => {
    return store.dispatch(actions.setRequiredSignatures(2, account, () => {})).then(() => {
      expect(store.getActions()).toContainEqual({data: {value: 2, valueName: 'signaturesRequired'}, type: PENDING_UPDATE_PROPS})
    })
  })
})
