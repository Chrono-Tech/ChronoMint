/* @flow */
import React from 'react';
import {
    browserHistory,
    Route,
    IndexRoute,
    Router
} from 'react-router';

import {Provider} from 'react-redux';
import configureStore from './redux/configureStore';

import NotFoundPage from './pages/NotFoundPage.js';
import FormPage from './pages/FormPage';
import TablePage from './pages/LOCPage';
import OperationsPage from './pages/OperationsPage';
import Dashboard from './pages/DashboardPage';


import IpfsPage from './actions/ipfs';

import App from './layouts/App';
import Auth from './layouts/Auth';
import Login from './pages/LoginPage';

import {chooseRole} from './redux/ducks/session';

const store = configureStore();

const requireAuth = (nextState, replace) => {
    const account = localStorage.getItem('chronoBankAccount');
    if (!account) {
        replace({
            pathname: '/login',
            state: {nextPathname: nextState.location.pathname}
        });
    } else {
        store.dispatch(chooseRole(account, x => x));
    }
};

const loginExistingUser = () => {
    const account = localStorage.getItem('chronoBankAccount');
    if (account) {
        store.dispatch(chooseRole(account, x => x));
    }
};

const router = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App} onEnter={requireAuth}>
                <IndexRoute component={Dashboard}/>
                <Route path="loc" component={FormPage}/>
                <Route path="locs" component={TablePage}/>
                <Route path="lh_story" component={TablePage}/>
                <Route path="operations" component={OperationsPage} />
                <Route path="ipfs" component={IpfsPage} />
            </Route>
            <Route component={Auth}>
                <Route path="/login" component={Login} onEnter={loginExistingUser}/>
            </Route>
            <Route path="*" component={NotFoundPage} />
        </Router>
    </Provider>
);

export default router;