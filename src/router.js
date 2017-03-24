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
import LOCsPage from './pages/LOCsPage';
import LHStoryPage from './pages/LHStoryPage';
import VotingPage from './pages/VotingPage';
import OperationsPage from './pages/OperationsPage';
import Dashboard from './pages/DashboardPage';
import WalletPage from './pages/WalletPage';
import ExchangePage from './pages/ExchangePage';
import RewardsPage from './pages/RewardsPage';
import SettingsPage from './pages/SettingsPage';
import NoticesPage from './pages/NoticesPage';
import ProfilePage from './pages/ProfilePage';
import App from './layouts/App';
import Auth from './layouts/Auth';
import Login from './pages/LoginPage';
import {login} from './redux/ducks/session/data';
import {getRates} from './redux/ducks/exchange/data';

const requireAuth = (nextState, replace) => {
    const account = localStorage.getItem('chronoBankAccount');
    if (!account) {
        replace({
            pathname: '/login',
            state: {nextPathname: nextState.location.pathname}
        });
    } else {
        store.dispatch(login(account, true));
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
                <Route path="locs" component={LOCsPage}/>
                <Route path="voting" component={VotingPage}/>
                <Route path="lh_story" component={LHStoryPage}/>
                <Route path="operations" component={OperationsPage}/>
                <Route path="settings" component={SettingsPage}/>
                <Route path="notices" component={NoticesPage}/>
                <Route path="profile" component={ProfilePage}/>
                <Route path="rewards" component={RewardsPage}/>
                <Route path="wallet">
                    <IndexRoute component={WalletPage}/>
                    <Route path="exchange"
                           component={ExchangePage}
                           onEnter={() => store.dispatch(getRates())}/>
                </Route>
            </Route>
            <Route component={Auth}>
                <Route path="login" component={Login} onEnter={loginExistingUser}/>
            </Route>
            <Route path="*" component={NotFoundPage}/>
        </Router>
    </Provider>
);

export default router;