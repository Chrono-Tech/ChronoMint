import * as actions from '../../../src/redux/wallet/actions'
import UserDAO from '../../../src/dao/UserDAO'
import {store} from '../../init'

const account = UserDAO.web3.eth.accounts[0]

describe('Time actions', () => {
  it('should show 0 time balance', () => {
    return store.dispatch(actions.updateTIMEBalance(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 0, 'type': 'wallet/WALLET_BALANCE_TIME'})
    })
  })

  it('should show 0 time deposit #1', () => {
    return store.dispatch(actions.updateTIMEDeposit(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 0, 'type': 'wallet/WALLET_TIME_DEPOSIT'})
    })
  })

  it('should request time & show 1000 time balance #1', () => {
    return store.dispatch(actions.requireTIME(account)).then(() => {
      expect(store.getActions()).toContainEqual({
        payload: {
          modalProps: {message: 'Time request executed successfully.', title: 'Require Time'},
          modalType: 'modals/ALERT_TYPE'
        },
        type: 'modal/SHOW'
      })
      expect(store.getActions()).toContainEqual({'payload': 1000, 'type': 'wallet/WALLET_BALANCE_TIME'})
    })
  })

  it('should show error on second request time', () => {
    return store.dispatch(actions.requireTIME(account)).then(() => {
      expect(store.getActions()).toContainEqual(
        {
          payload: {
            modalProps: {message: 'Time request not completed.', title: 'Error'},
            modalType: 'modals/ALERT_TYPE'
          },
          type: 'modal/SHOW'
        })
    })
  })

  it('should show 1000 time balance #1', () => {
    return store.dispatch(actions.updateTIMEBalance(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 1000, 'type': 'wallet/WALLET_BALANCE_TIME'})
    })
  })

  it('should deposit 100 time', () => {
    return store.dispatch(actions.depositTIME(100, account)).then(() => {
      expect(store.getActions()).toContainEqual({payload: true, type: 'wallet/WALLET_BALANCE_TIME_FETCH'})
    })
  })

  it('should show 100 time deposit', () => {
    return store.dispatch(actions.updateTIMEDeposit(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 100, 'type': 'wallet/WALLET_TIME_DEPOSIT'})
    })
  })

  it('should show 900 time balance', () => {
    return store.dispatch(actions.updateTIMEBalance(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 900, type: 'wallet/WALLET_BALANCE_TIME'})
    })
  })

  it('should withdraw 100 time', () => {
    return store.dispatch(actions.withdrawTIME(100, account)).then(() => {
      expect(store.getActions()).toContainEqual({payload: true, type: 'wallet/WALLET_BALANCE_TIME_FETCH'})
    })
  })

  it('should show 0 time deposit #2', () => {
    return store.dispatch(actions.updateTIMEDeposit(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 0, type: 'wallet/WALLET_TIME_DEPOSIT'})
    })
  })

  it('should show 1000 time balance #2', () => {
    return store.dispatch(actions.updateTIMEBalance(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 1000, type: 'wallet/WALLET_BALANCE_TIME'})
    })
  })

  it('should show 0 LHT balance of Contracts Manager', () => {
    return store.dispatch(actions.updateCMLHTBalance()).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 0, type: 'wallet/WALLET_CM_BALANCE_LHT'})
    })
  })
})
