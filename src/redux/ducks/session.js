import {browserHistory} from 'react-router';

import App from '../../app';
import LOC from 'contracts/LOC.sol';

const SESSION_CREATE = 'session/CREATE';
const SESSION_DESTROY = 'session/DESTROY';

const initialState = {
    account: null,
    profile: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SESSION_CREATE:
            const {profile, account} = action.payload;
            localStorage.setItem('chronoBankAccount', account);
            return {
                account,
                profile
            };
        case SESSION_DESTROY:
            localStorage.removeItem('chronoBankAccount');
            return initialState;
        default:
            return state;
    }
};

const createSession = (payload) => ({type: SESSION_CREATE, payload});
const destroySession = () => ({type: SESSION_DESTROY});

const checkLOCControllers = (index, LOCCount, account) => {
    if (index >= LOCCount) {
        return Promise.resolve(false);
    }
    return App.chronoMint.getLOCbyID.call(index, {from: App.chronoMint.address}).then(r => {
        const loc = LOC.at(r);
        return loc.isController.call(account, {from: account}).then(r => {
            if (r) {
                App.loc = loc;
                console.log(App);
                return true;
            } else {
                return checkLOCControllers(index + 1, LOCCount, account);
            }
        });
    });
};

const chooseRole = (account, callback) => (dispatch) => {
    App.chronoMint.isCBE.call(account, {from: account})
        .then(cbe => {
            cbe = true;/////////////////////////////////////////////
            if (cbe) {
                dispatch(createSession({
                    account,
                    profile: {
                        name: 'CBE Admin',
                        email: 'cbe@chronobank.io',
                        type: 'cbe'
                    }
                }));
                callback.call();
            } else {
                App.chronoMint.getLOCCount.call({from: account})
                    .then(r => {
                        checkLOCControllers(0, r.toNumber(), account).then(r => {
                            if (r) {
                                dispatch(createSession({
                                    account,
                                    profile: {
                                        name: 'LOC Admin',
                                        email: 'loc@chronobank.io',
                                        type: 'loc'
                                    }
                                }));
                                callback.call();
                            } else {
                                console.log('Account not found');
                            }
                        });
                    });
            }
        })
        .catch(error => console.error(error));
};

const logout = () => (dispatch) => {
    Promise.resolve(dispatch(destroySession()))
        .then(() => browserHistory.push('/login'));
};


export {
    logout,
    chooseRole
}

export default reducer;