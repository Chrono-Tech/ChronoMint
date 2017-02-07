/* @flow */
import React from 'react';
import {
    Route,
    IndexRoute,
    Router
} from 'react-router';

import {Provider} from 'react-redux';
import {store, history} from './redux/configureStore';

import NotFoundPage from './pages/NotFoundPage.js';
import FormPage from './pages/FormPage';
import LOCPage from './pages/LOCPage';
import OperationsPage from './pages/OperationsPage';
import Dashboard from './pages/DashboardPage';
import WalletPage from './pages/WalletPage';
import ExchangePage from './pages/ExchangePage';
import RewardsPage from './pages/RewardsPage';

import App from './layouts/App';
import Auth from './layouts/Auth';
import Login from './pages/LoginPage';

import {checkRole, login} from './redux/ducks/session';

const requireAuth = (nextState, replace) => {
    const account = localStorage.getItem('chronoBankAccount');
    if (!account) {
        replace({
            pathname: '/login',
            state: {nextPathname: nextState.location.pathname}
        });
    } else {
        store.dispatch(checkRole(account));
    }
};

const loginExistingUser = () => {
    const account = localStorage.getItem('chronoBankAccount');
    if (account) {
        store.dispatch(login(account));
    }
};

const router = (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App} onEnter={requireAuth}>
                <IndexRoute component={Dashboard}/>
                <Route path="loc" component={FormPage}/>
                <Route path="locs" component={LOCPage}/>
                <Route path="lh_story" component={LOCPage}/>
                <Route path="operations" component={OperationsPage} />
                <Route path="rewards" component={RewardsPage} />
                <Route path="wallet">
                    <IndexRoute component={WalletPage} />
                    <Route path="exchange" component={ExchangePage} />
                </Route>
            </Route>
            <Route component={Auth}>
                <Route path="login" component={Login} onEnter={loginExistingUser}/>
            </Route>
            <Route path="*" component={NotFoundPage} />
        </Router>
    </Provider>
);

export default router;