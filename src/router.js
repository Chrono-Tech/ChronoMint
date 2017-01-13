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

const requireAuth = (nextState, replace) => {
    if (!localStorage.getItem('chronoBankAccount')) {
        replace({
            pathname: '/login',
            state: {nextPathname: nextState.location.pathname}
        });
    }
};

const loginExistingUser = (nextState, replace) => {
    if (localStorage.getItem('chronoBankAccount')) {
        replace({
            pathname: '/',
            state: {nextPathname: nextState.location.pathname}
        });
    }
};

const router = (
    <Provider store={configureStore()}>
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