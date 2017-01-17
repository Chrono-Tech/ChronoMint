/* @flow */
import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import themeDefault from 'themeDefault';
import injectTapEventPlugin from 'react-tap-event-plugin';
import router from './router.js';

import Web3 from 'web3';
import truffleConfig from '../truffle.js'
const web3Location = `http://${truffleConfig.rpc.host}:${truffleConfig.rpc.port}`;

import ChronoMint from 'contracts/ChronoMint.sol';
import LOC from 'contracts/LOC.sol';

import './styles.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';


class App {
    constructor() {
        this.web3 = typeof web3 !== 'undefined' ?
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(web3Location));

        ChronoMint.setProvider(this.web3.currentProvider);
        LOC.setProvider(this.web3.currentProvider);

        this.chronoMint = ChronoMint.deployed();
        this.loc;
    }

    bootstrapContracts(): void {
        const chronoMint = this.chronoMint;
        const accounts = this.web3.eth.accounts;

        chronoMint.addKey(accounts[1],{from: accounts[0], gas: 3000000});
        chronoMint.addKey(accounts[2],{from: accounts[0], gas: 3000000});

        LOC.new({from: accounts[0], gas: 3000000}).then(function (r) {
            console.log('we are here');
            console.log(r.address);
            App.loc = LOC.at(r.address);
            App.loc.setLOCdata("LOC 1", accounts[0], accounts[3], 1000, "QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB", 1484554656, {from: accounts[0], gas: 3000000}).then(function (r) {
                chronoMint.proposeLOC(r.address);
                chronoMint.approveContract(r.address, {from: accounts[1]});
                chronoMint.approveContract(r.address, {from: accounts[2]});
                App.loc.getName.call('name').then(function (r) {
                    console.log('we are here2');
                    console.log(r);
                });
            }).catch(function (e) {
                console.log(e);
            });
        }).catch(function (e) {
            console.log(e);
        });
    }

    start(): void {
        // Needed for onTouchTap
        // http://stackoverflow.com/a/34015469/988941
        injectTapEventPlugin();

        render(
            <MuiThemeProvider muiTheme={themeDefault}>{router}</MuiThemeProvider>,
            document.getElementById('react-root')
        );
    }
}

export default new App();