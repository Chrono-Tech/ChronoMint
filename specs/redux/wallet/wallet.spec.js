import * as actions from '../../../src/redux/wallet/wallet';
import UserDAO from '../../../src/dao/UserDAO';
import {store} from '../../init';

const account = UserDAO.web3.eth.accounts[0];

describe('Time actions', () => {

  it('should show 0 time balance', () => {
    return store.dispatch(actions.updateTimeBalance(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 0, 'type': 'wallet/SET_TIME_BALANCE_SUCCESS'});
    })
  });

  it('should request time & show 1000 time balance #1', () => {
    return store.dispatch(actions.requireTime(account)).then(() => {
      expect(store.getActions()).toContainEqual({
        payload: {
          modalProps: {message: 'Time request sent successfully.', title: 'Require Time'},
          modalType: 'modals/ALERT_TYPE'
        }, type: 'modal/SHOW'
      });
      // expect(store.getActions()).toContainEqual({'payload': 1000, 'type': 'wallet/SET_TIME_BALANCE_SUCCESS'});
    })
  });

  it('should show 0 time deposit #1', () => {
    return store.dispatch(actions.updateTimeDeposit(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 0, 'type': 'wallet/SET_TIME_DEPOSIT_SUCCESS'});
    })
  });

  it('should show error on second request time', () => {
    return store.dispatch(actions.requireTime(account)).then(() => {
      expect(store.getActions()).toContainEqual(
        {
          payload: {
            modalProps: {message: 'Time request not completed.', title: 'Error'},
            modalType: 'modals/ALERT_TYPE'
          }, type: 'modal/SHOW'
        });
    })
  });

  it.skip('should show 1000 time balance #1', () => {
    return store.dispatch(actions.updateTimeBalance(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 1000, 'type': 'wallet/SET_TIME_BALANCE_SUCCESS'});
    })
  });

  it.skip('should deposit 100 time', () => {
    return store.dispatch(actions.depositTime(100, account)).then(() => {
      expect(store.getActions()).toContainEqual({'type': 'wallet/SET_TIME_BALANCE_START'});
    })
  });

  it.skip('should show 100 time deposit', () => {
    return store.dispatch(actions.updateTimeDeposit(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 100, 'type': 'wallet/SET_TIME_DEPOSIT_SUCCESS'});
    })
  });

  it.skip('should show 900 time balance', () => {
    return store.dispatch(actions.updateTimeBalance(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 900, 'type': 'wallet/SET_TIME_BALANCE_SUCCESS'});
    })
  });

  it.skip('should withdraw 100 time', () => {
    return store.dispatch(actions.withdrawTime(100, account)).then(() => {
      expect(store.getActions()).toContainEqual({'type': 'wallet/SET_TIME_BALANCE_START'});
    })
  });

  it('should show 0 time deposit #2', () => {
    return store.dispatch(actions.updateTimeDeposit(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 0, 'type': 'wallet/SET_TIME_DEPOSIT_SUCCESS'});
    })
  });

  it.skip('should show 1000 time balance #2', () => {
    return store.dispatch(actions.updateTimeBalance(account)).then(() => {
      expect(store.getActions()).toContainEqual({'payload': 1000, 'type': 'wallet/SET_TIME_BALANCE_SUCCESS'});
    })
  });

});