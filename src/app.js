/* @flow */
import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import themeDefault from 'themeDefault';
import injectTapEventPlugin from 'react-tap-event-plugin';
import router from './router.js';
import ChronoMint from './contracts/ChronoMint.sol';
import LOC from './contracts/LOC.sol';
import ChronoBankAsset from './contracts/ChronoBankAsset.sol';
import ChronoBankAssetWithFee from './contracts/ChronoBankAssetWithFee.sol';
import ChronoBankPlatform from './contracts/ChronoBankPlatform.sol'
import ChronoBankAssetProxy from './contracts/ChronoBankAssetProxy.sol';
import EventsHistory from './contracts/EventsHistory.sol';
import './styles.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';
import Web3 from 'web3';
import truffleConfig from '../truffle.js'
import bytes32 from './bytes32';

const web3Location = `http://${truffleConfig.rpc.host}:${truffleConfig.rpc.port}`;

class App {
    constructor() {
        this.web3 = typeof web3 !== 'undefined' ?
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(web3Location));

        ChronoMint.setProvider(this.web3.currentProvider);
        //Stub.setProvider(this.web3.currentProvider);
        ChronoBankPlatform.setProvider(this.web3.currentProvider);
        ChronoBankAssetProxy.setProvider(this.web3.currentProvider);
        LOC.setProvider(this.web3.currentProvider);
        ChronoBankAsset.setProvider(this.web3.currentProvider);
        ChronoBankAssetWithFee.setProvider(this.web3.currentProvider);
        EventsHistory.setProvider(this.web3.currentProvider);

        this.chronoMint = ChronoMint.deployed();
        this.platform = ChronoBankPlatform.deployed();
        this.proxy = ChronoBankAssetProxy.deployed();
        this.time = ChronoBankAsset.deployed();
        this.lht = ChronoBankAssetWithFee.deployed();
        this.eventsHistory = EventsHistory.deployed();
        this.loc = null;
    }

    bootstrapContracts(): void {

        const {chronoMint,platform,proxy,time,eventsHistory} = this;
        const accounts = this.web3.eth.accounts;

        const SYMBOL = bytes32(10);
        const SYMBOL2 = bytes32(1000);
        const NAME = 'Test Name';
        const DESCRIPTION = 'Test Description';
        const VALUE = 1001;
        const VALUE2 = 30000;
        const BASE_UNIT = 2;
        const IS_REISSUABLE = true;

        platform.setupEventsHistory(eventsHistory.address,{from: accounts[0]}).then((r) => {
            console.log(r);
            platform.issueAsset(SYMBOL, VALUE, NAME, DESCRIPTION, BASE_UNIT, IS_REISSUABLE, {
                from: accounts[0],
                gas: 3000000
            }).then((r) => {
                console.log(r);
                proxy.init(platform.address, SYMBOL, NAME, {from: accounts[0]}).then((r) => {
                    console.log(r);
                    console.log(proxy);
                    proxy.proposeUpgrade(time.address, {from: accounts[0]}).then((r) => {
                        time.init(proxy.address, {from: accounts[0]}).then((r) => {
                            platform.setProxy(proxy.address, SYMBOL, {from: accounts[0]}).then((r) => {
                                proxy.totalSupply().then((r) => {
                                    console.log(r);
                                });
                            });
                        });
                    }).catch(function (e) {
                        console.error(e);
                    });
                }).catch(function (e) {
                    console.error(e);
                });
            }).catch(function (e) {
                console.error(e);
            })
        }).catch(function (e) {
            console.error(e);
        });
        //console.log(chronoMint);
        //console.log(platform);

        chronoMint.addKey(accounts[1], {from: accounts[0], gas: 3000000});
        chronoMint.addKey(accounts[2], {from: accounts[0], gas: 3000000});
        let loc;
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
            <MuiThemeProvider muiTheme={themeDefault}>{router}</MuiThemeProvider>,
            document.getElementById('react-root')
        );
    }
}

export default new App();