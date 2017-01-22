/* @flow */
import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import themeDefault from 'themeDefault';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes.js';
import ChronoMint from 'contracts/ChronoMint.sol';
import LOC from 'contracts/LOC.sol';
import './styles.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';
import Web3 from 'web3';
import truffleConfig from '../truffle.js'

const web3Location = `http://${truffleConfig.rpc.host}:${truffleConfig.rpc.port}`;

class App {
    constructor() {
        this.web3 = typeof web3 !== 'undefined' ?
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(web3Location));

        ChronoMint.setProvider(this.web3.currentProvider);
        LOC.setProvider(this.web3.currentProvider);

        this.chronoMint = ChronoMint.deployed();
        this.loc = null;
    }

    bootstrapContracts(): void {
        const {chronoMint} = this;
        const accounts = this.web3.eth.accounts;

        chronoMint.addKey(accounts[1], {from: accounts[0], gas: 3000000});
        chronoMint.addKey(accounts[2], {from: accounts[0], gas: 3000000});
        for(let i = 3; i < 9; i++) {
            chronoMint.proposeLOC(
                    `LOC ${i - 2}`,
                    accounts[i],
                    1000,
                    'mTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB',
                    1484554656, {
                        from: accounts[0],
                        gas: 3000000
                    }).then((r) => {
                        chronoMint.approveContract(r.address, {from: accounts[1], gas: 3000000});
                        chronoMint.approveContract(r.address, {from: accounts[2], gas: 3000000});
                    }).catch(function (e) {
                        console.error(e);
                    });
            localStorage.setItem('setupLoc', true);
        }
    }

    start(): void {
        // Needed for onTouchTap
        // http://stackoverflow.com/a/34015469/988941
        injectTapEventPlugin();

        render(
            <MuiThemeProvider muiTheme={themeDefault}>{routes}</MuiThemeProvider>,
            document.getElementById('react-root')
        );
    }
}

export default new App();