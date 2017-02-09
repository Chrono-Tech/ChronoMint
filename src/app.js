/* @flow */
import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import themeDefault from 'themeDefault';
import injectTapEventPlugin from 'react-tap-event-plugin';
import router from './router.js';

import AppDAO from './dao/AppDAO';
import ExchangeDAO from './dao/ExchangeDAO';
import LHTProxyDAO from './dao/LHTProxyDAO';

import './styles.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';

class App {
    start(): void {
        // Needed for onTouchTap
        // http://stackoverflow.com/a/34015469/988941
        injectTapEventPlugin();

        // TODO: remove;
        let exchangeAddress;
        Promise.all([
            AppDAO.reissueAsset('LHT', 2500, localStorage.getItem('chronoBankAccount')),
            ExchangeDAO.initLHT(localStorage.getItem('chronoBankAccount')),
            ExchangeDAO.getAddress()]
        ).then((values) => {
            console.log(values);
            exchangeAddress = values[2];
            AppDAO.sendLht(exchangeAddress, 500, localStorage.getItem('chronoBankAccount'));
        }).then(() => LHTProxyDAO.getAccountBalance(exchangeAddress))
            .then(res => console.log(res.toNumber()));


        // this works.

        render(
            <MuiThemeProvider muiTheme={themeDefault}>{router}</MuiThemeProvider>,
            document.getElementById('react-root')
        );
    }
}

export default new App();
