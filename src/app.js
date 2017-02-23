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
            exchangeAddress = values[2];
            console.log(exchangeAddress);
            AppDAO.sendLht(exchangeAddress, 500, localStorage.getItem('chronoBankAccount'));
            AppDAO.sendLht(localStorage.getItem('chronoBankAccount'), 500, localStorage.getItem('chronoBankAccount'));
        }).then(() => LHTProxyDAO.getAccountBalance(exchangeAddress))
            .then(res => console.log(res.toNumber()));

        AppDAO.setExchangePrices(AppDAO.web3.toWei(0.01), AppDAO.web3.toWei(0.02), localStorage.getItem('chronoBankAccount'));

        // this works.

        // TODO: remove    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        const accounts = AppDAO.web3.eth.accounts;
        AppDAO.chronoMint.then(deployed => deployed.addKey(accounts[1], {from: accounts[0], gas: 3000000})).then( () => {
        });
        //TODO   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        render(
            <MuiThemeProvider muiTheme={themeDefault}>{router}</MuiThemeProvider>,
            document.getElementById('react-root')
        );
    }
}

export default new App();