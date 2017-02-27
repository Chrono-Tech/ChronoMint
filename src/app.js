import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import themeDefault from './themeDefault';
import injectTapEventPlugin from 'react-tap-event-plugin';
import router from './router.js';

import IPFSDAO from './dao/IPFSDAO';
import OrbitDAO from './dao/OrbitDAO';
import AppDAO from './dao/AppDAO';
import ExchangeDAO from './dao/ExchangeDAO';
import LHTDAO from './dao/LHTDAO';
import LHTProxyDAO from './dao/LHTProxyDAO';

import './styles.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';

class App {
    start() {
        IPFSDAO.init().then(ipfsNode => {
            OrbitDAO.init(ipfsNode);

            /** Needed for onTouchTap @link http://stackoverflow.com/a/34015469/988941 */
            injectTapEventPlugin();

            // TODO: remove;
            let exchangeAddress;
            Promise.all([
                AppDAO.reissueAsset('LHT', 2500, localStorage.getItem('chronoBankAccount')),
                LHTDAO.init(localStorage.getItem('chronoBankAccount')),
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
            AppDAO.isCBE(accounts[1]).then(cbe => {
                if (!cbe) {
                    AppDAO.chronoMint.then(deployed => deployed.addKey(accounts[1], {from: accounts[0], gas: 3000000})).then( () => {});
                }
            });
            //TODO   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

            render(
                <MuiThemeProvider muiTheme={themeDefault}>{router}</MuiThemeProvider>,
                document.getElementById('react-root')
            );
        }, error => {
            render(
                <div style={{margin: '50px'}}>
                    <p>Oops! Something went wrong. Please try again later or contact with administrator.</p>
                    <p>IPFS initialization failed with error: {error}</p>
                </div>,
                document.getElementById('react-root')
            );
        });
    }
}

export default new App();