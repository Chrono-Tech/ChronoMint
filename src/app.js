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

import './styles.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';


class App {
    constructor() {
        this.web3 = typeof web3 !== 'undefined' ?
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(web3Location));


        ChronoMint.setProvider(this.web3.currentProvider);

        this.chronoMint = ChronoMint.deployed();
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