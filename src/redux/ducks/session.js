import {browserHistory} from 'react-router'

import App from '../../app';

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

const chooseRole = (account) => (dispatch) => {
    App.chronoMint.isCBE.call(account, {from: account})
        .then(cbe => {
            if (cbe) {
                dispatch(createSession({
                    account,
                    profile: {
                        name: 'CBE Admin',
                        email: 'cbe@chronobank.io',
                        type: 'cbe'
                    }
                }));
            } else {
                // Check LOCs
                console.log(account);
                dispatch(createSession({
                    account,
                    profile: {
                        name: 'LOC Admin',
                        email: 'loc@chronobank.io',
                        type: 'loc'
                    }
                }));
            }
        })
        .catch(error => console.error(error));
};

const login = (account) => (dispatch) => {
    App.chronoMint.isCBE.call(account, {from: account})
        .then(cbe => {
            if (cbe) {
                dispatch(createSession({
                    account,
                    profile: {
                        name: 'CBE Admin',
                        email: 'cbe@chronobank.io',
                        type: 'cbe'
                    }
                }));
            } else {
                // Check LOCs
                console.log(account);
                dispatch(createSession({
                    account,
                    profile: {
                        name: 'LOC Admin',
                        email: 'loc@chronobank.io',
                        type: 'loc'
                    }
                }));
            }
            browserHistory.push('/');
        })
        .catch(error => console.error(error));
};

const logout = () => (dispatch) => {
    Promise.resolve(dispatch(destroySession()))
        .then(() => browserHistory.push('/login'));
};


export {
    login,
    logout,
    chooseRole
}

export default reducer;