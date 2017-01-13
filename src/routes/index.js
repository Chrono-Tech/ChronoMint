import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../containers/App';
import App2 from '../containers/App2';
import NotFoundPage from '../containers/NotFoundPage.js';
import LoginPage from '../containers/LoginPage';
import FormPage from '../containers/FormPage';
import Form2Page from '../containers/Form2Page';
import TablePage from '../containers/TablePage';
import Table2Page from '../containers/Table2Page';
import OpList from '../containers/OpList';
import Op2List from '../containers/Op2List';
import Dashboard from '../containers/DashboardPage';
import Dashboard2 from '../containers/Dashboard2Page';

export default (store) => (
    <Route>
        <IndexRoute component={Dashboard}/>
        <Route path="login" component={LoginPage}/>
        <Route path="cbe" component={App}>
            <Route path="dashboard" component={Dashboard}/>
            <Route path="form" component={FormPage}/>
            <Route path="table" component={TablePage}/>
            <Route path="operation" component={OpList}/>
            <Route path="*" component={NotFoundPage}/>
        </Route>
        <Route path="loc" component={App2}>
            <Route path="dashboard2" component={Dashboard2}/>
            <Route path="form2" component={Form2Page}/>
            <Route path="table2" component={TablePage}/>
            <Route path="operation2" component={Op2List}/>
            <Route path="*" component={NotFoundPage}/>
        </Route>
    </Route>
)
