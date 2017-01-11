import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../containers/App';
import NotFoundPage from '../containers/NotFoundPage.js';
import LoginPage from '../containers/LoginPage';
import FormPage from '../containers/FormPage';
import TablePage from '../containers/TablePage';
import OpList from '../containers/OpList';
import Dashboard from '../containers/DashboardPage';
import Dashboard2 from '../containers/Dashboard2Page';

export default (store) => (
    <Route>
        <IndexRoute component={Dashboard}/>
        <Route path="login" component={LoginPage}/>
        <Route path="/" component={App}>

            <Route path="dashboard" component={Dashboard}/>
            <Route path="dashboard2" component={Dashboard2}/>
            <Route path="form" component={FormPage}/>
            <Route path="form2" component={FormPage}/>
            <Route path="table" component={TablePage}/>
            <Route path="operation" component={OpList}/>
            <Route path="*" component={NotFoundPage}/>
        </Route>
    </Route>
)
