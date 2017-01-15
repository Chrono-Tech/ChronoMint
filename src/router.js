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
import TablePage from './pages/TablePage';
import Dashboard from './pages/DashboardPage';

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
        store.dispatch(chooseRole(account));
    }
};

const loginExistingUser = () => {
    const account = localStorage.getItem('chronoBankAccount');
    if (account) {
        store.dispatch(restoreSession(account));
    }
};

const router = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App} onEnter={requireAuth}>
                <IndexRoute component={Dashboard}/>
                <Route path="form" component={FormPage}/>
                <Route path="table" component={TablePage}/>
            </Route>
            <Route component={Auth}>
                <Route path="/login" component={Login} onEnter={loginExistingUser}/>
            </Route>
            <Route path="*" component={NotFoundPage} />
        </Router>
    </Provider>
);

export default router;