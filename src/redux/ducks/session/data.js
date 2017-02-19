import {push, replace} from 'react-router-redux';
import AppDAO from '../../../dao/AppDAO';
import LocDAO from '../../../dao/LocDAO';
import NoticeModel from '../../../models/notices/NoticeModel';
import noticeFactory from '../../../models/notices/factory';
import {List} from 'immutable';
import {listNotifier} from '../notifier/notifier';

export const SESSION_CREATE_START = 'session/CREATE_START';
export const SESSION_CREATE_SUCCESS = 'session/CREATE_SUCCESS';
export const SESSION_DESTROY = 'session/DESTROY';

const initialState = {
    account: null,
    profile: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SESSION_CREATE_SUCCESS:
            const {profile, account} = action.payload;
            localStorage.setItem('chronoBankAccount', account);
            return {
                account,
                profile
            };
        case SESSION_DESTROY:
            localStorage.removeItem('chronoBankAccount');
            localStorage.removeItem('chronoBankNotices');
            return initialState;
        default:
            return state;
    }
};

const createSessionStart = () => ({type: SESSION_CREATE_START});
const createSessionSuccess = (payload) => ({type: SESSION_CREATE_SUCCESS, payload});
const destroySession = () => ({type: SESSION_DESTROY});

const checkLOCControllers = (index, LOCCount, account) => {
    if (index >= LOCCount) {
        return Promise.resolve(false);
    }
    return AppDAO.getLOCbyID(index).then(r => {
        const loc = new LocDAO(r);
        return loc.isController(account).then(r => {
            if (r) {
                return true;
            } else {
                return checkLOCControllers(index + 1, LOCCount, account);
            }
        });
    });
};

const checkRole = (account) => (dispatch) => {
    dispatch(createSessionStart());
    AppDAO.isCBE(account).then(cbe => {
            if (cbe) {
                dispatch(createSessionSuccess({
                    account,
                    profile: {
                        name: 'CBE Admin',
                        email: 'cbe@chronobank.io',
                        type: 'cbe'
                    }
                }));
            } else {
                AppDAO.getLOCCount(account)
                    .then(r => {
                        checkLOCControllers(0, r.toNumber(), account).then(r => {
                            if (r) {
                                dispatch(createSessionSuccess({
                                    account,
                                    profile: {
                                        name: 'LOC Admin',
                                        email: 'loc@chronobank.io',
                                        type: 'loc'
                                    }
                                }));
                            } else {
                                dispatch(createSessionSuccess({
                                    account,
                                    profile: {
                                        name: 'ChronoMint User',
                                        email: 'user@chronobank.io',
                                        type: 'user'
                                    }
                                }));
                                dispatch(push('/wallet'));
                            }
                        });
                    });
            }
        })
        .catch(error => console.error(error));
};

const login = (account) => (dispatch) => {
    dispatch(createSessionStart());
    AppDAO.isCBE(account)
        .then(cbe => {
            if (cbe) {
                dispatch(createSessionSuccess({
                    account,
                    profile: {
                        name: 'CBE Admin',
                        email: 'cbe@chronobank.io',
                        type: 'cbe'
                    }
                }));
                dispatch(replace('/'));
            } else {
                AppDAO.getLOCCount(account)
                    .then(r => {
                        checkLOCControllers(0, r.toNumber(), account).then(r => {
                            if (r) {
                                dispatch(createSessionSuccess({
                                    account,
                                    profile: {
                                        name: 'LOC Admin',
                                        email: 'loc@chronobank.io',
                                        type: 'loc'
                                    }
                                }));
                                dispatch(push('/'));
                            } else {
                                dispatch(createSessionSuccess({
                                    account,
                                    profile: {
                                        name: 'ChronoMint User',
                                        email: 'user@chronobank.io',
                                        type: 'user'
                                    }
                                }));
                                dispatch(push('/wallet'));
                            }
                        });
                    });
            }
        })
        .catch(error => console.error(error));
};

const logout = () => (dispatch) => {
    Promise.resolve(dispatch(destroySession()))
        .then(() => dispatch(push('/login')));
};

const retrieveNotices = () => {
    let notices = null;
    try {notices = JSON.parse(localStorage.getItem('chronoBankNotices'))} catch (e) {}
    if (!Array.isArray(notices)) notices = [];
    return notices;
};

const listNotices = (data = null) => (dispatch) => {
    let notices = data === null ? retrieveNotices() : data;
    let list = new List;
    for (let i in notices) {
        if (notices.hasOwnProperty(i)) {
            list = list.set(i, noticeFactory(notices[i].name, notices[i].data));
        }
    }
    dispatch(listNotifier(list));
};

/**
 * @returns List updated with new NoticeModel
 */
const saveNotice = (notice: NoticeModel) => (dispatch) => {
    let notices = retrieveNotices();
    notices.unshift({
        name: notice.constructor.name,
        data: notice.toJS()
    });
    notices.splice(5); // we store only 5 last notices
    localStorage.setItem('chronoBankNotices', JSON.stringify(notices));
    dispatch(listNotices(notices));
};

export {
    logout,
    login,
    checkRole,
    listNotices,
    saveNotice
}

export default reducer;
