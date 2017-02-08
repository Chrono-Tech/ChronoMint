/* @flow */
import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import themeDefault from 'themeDefault';
import injectTapEventPlugin from 'react-tap-event-plugin';
import router from './router.js';
import contract from 'truffle-contract';
import Web3 from 'web3';
import ChronoMintJSON from './contracts/ChronoMint.json';
import LOCJSON from './contracts/LOC.json';
import ChronoBankAssetJSON from './contracts/ChronoBankAsset.json';
import ChronoBankAssetWithFeeJSON from './contracts/ChronoBankAssetWithFee.json';
import ChronoBankPlatformJSON from './contracts/ChronoBankPlatform.json'
import ChronoBankAssetProxyJSON from 'contracts/ChronoBankAssetProxy.json';
import ChronoBankAssetWithFeeProxyJSON from './contracts/ChronoBankAssetWithFeeProxy.json';
import EventsHistoryJSON from './contracts/EventsHistory.json';
import ChronoBankPlatformEmitterJSON from './contracts/ChronoBankPlatformEmitter.json'
import bytes32 from './utils/bytes32'; // TODO Unused import
import {getLOCS} from 'redux/ducks/locs';
import TimeDAO from './dao/TimeDAO';
import PlatformDAO from './dao/PlatformDAO';
import './styles.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';

const web3Location = `http://localhost:8545`;

let ChronoMint = contract(ChronoMintJSON);
let LOC = contract(LOCJSON);
let ChronoBankAsset = contract(ChronoBankAssetJSON);
let ChronoBankAssetWithFee = contract(ChronoBankAssetWithFeeJSON);
let ChronoBankPlatform = contract(ChronoBankPlatformJSON);
let ChronoBankAssetProxy = contract(ChronoBankAssetProxyJSON);
let ChronoBankAssetWithFeeProxy = contract(ChronoBankAssetWithFeeProxyJSON);
let EventsHistory = contract(EventsHistoryJSON);
let ChronoBankPlatformEmitter = contract(ChronoBankPlatformEmitterJSON);

class App {
    constructor() {
        console.log(TimeDAO);
        this.web3 = typeof web3 !== 'undefined' ?
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(web3Location));

        //console.log(this.web3);
        ChronoMint.setProvider(this.web3.currentProvider);
        ChronoBankPlatform.setProvider(this.web3.currentProvider);
        ChronoBankAssetProxy.setProvider(this.web3.currentProvider);
        ChronoBankAssetWithFeeProxy.setProvider(this.web3.currentProvider);
        LOC.setProvider(this.web3.currentProvider);
        ChronoBankAsset.setProvider(this.web3.currentProvider);
        ChronoBankAssetWithFee.setProvider(this.web3.currentProvider);
        EventsHistory.setProvider(this.web3.currentProvider);
        ChronoBankPlatformEmitter.setProvider(this.web3.currentProvider);

        this.chronoMint = ChronoMint.deployed();
        this.platform = ChronoBankPlatform.deployed();
        this.timeProxy = ChronoBankAssetProxy.deployed();
        this.lhtProxy = ChronoBankAssetWithFeeProxy.deployed();
        this.time = ChronoBankAsset.deployed();
        this.lht = ChronoBankAssetWithFee.deployed();
        this.eventsHistory = EventsHistory.deployed();

        this.loc = null;

        this.platformEmitter = ChronoBankPlatformEmitter.deployed();
        const fakeArgs = [0,0,0,0,0,0,0,0];

        this.platformEmitter.then(instance => {
            console.log(instance.contract.emitTransfer.getData.apply(this, fakeArgs).slice(0, 10));
            console.log(instance.contract.emitIssue.getData.apply(this, fakeArgs).slice(0, 10));
            console.log(instance.contract.emitRevoke.getData.apply(this, fakeArgs).slice(0, 10));
            console.log(instance.contract.emitOwnershipChange.getData.apply(this, fakeArgs).slice(0, 10));
            console.log(instance.contract.emitApprove.getData.apply(this, fakeArgs).slice(0, 10));
            console.log(instance.contract.emitRecovery.getData.apply(this, fakeArgs).slice(0, 10));
        });

        PlatformDAO.watchAll((e,r) => console.log(e, r));

    }

    //noinspection JSAnnotator
    bootstrapContracts(): void {

        const {chronoMint,platform,timeProxy,lhtProxy,time,lht,eventsHistory,platformEmitter} = this;
        const accounts = this.web3.eth.accounts;

        const SYMBOL = 'TIME';
        const SYMBOL2 = 'LHT';
        const NAME = 'Time Token';
        const DESCRIPTION = 'ChronoBank Time Shares';
        const NAME2 = 'Labour-hour Token';
        const DESCRIPTION2 = 'ChronoBank Lht Assets';
        const VALUE = 10000;
        const VALUE2 = 30000;
        const BASE_UNIT = 2;
        const IS_REISSUABLE = true;


        platform.setupEventsHistory(eventsHistory.address, {from: accounts[0]}).then((r) => {
            eventsHistory.addEmitter('0x515c1457', platformEmitter.address, {from: accounts[0]}).then((r) => {
                console.log('we are here');
                //Time token setup and distribution

                platform.issueAsset(SYMBOL, VALUE, NAME, DESCRIPTION, BASE_UNIT, IS_REISSUABLE, {
                    from: accounts[0],
                    gas: 3000000
                }).then((r) => {
                    console.log(r);
                    timeProxy.init(platform.address, SYMBOL, NAME, {from: accounts[0]}).then((r) => {
                        console.log(r);
                        timeProxy.proposeUpgrade(time.address, {from: accounts[0]}).then((r) => {
                            time.init(timeProxy.address, {from: accounts[0]}).then((r) => {
                                platform.setProxy(timeProxy.address, SYMBOL, {from: accounts[0]}).then((r) => {
                                    timeProxy.totalSupply(SYMBOL).then((r) => {
                                        console.log(r);
                                        for(let i = 1; i < 9; i++) {
                                            timeProxy.transfer(accounts[i], 15, {from: accounts[0], gas: 3000000}).then((r) => {
                                                timeProxy.balanceOf(accounts[i]).then((r) => {
                                                    console.log(accounts[i]);
                                                    console.log(r.toNumber());
                                                });
                                            }).catch(function (e) {
                                                console.error(e);
                                            });
                                        }
                                    });
                                });
                            });
                        })
                    })
                });

                //LHT Token setup and distribution
                platform.issueAsset(SYMBOL2, VALUE2, NAME2, DESCRIPTION2, BASE_UNIT, IS_REISSUABLE, {
                    from: accounts[0],
                    gas: 3000000
                }).then((r) => {
                    console.log(r);
                    lhtProxy.init(platform.address, SYMBOL2, NAME2, {from: accounts[0]}).then((r) => {
                        console.log(r);
                        lhtProxy.proposeUpgrade(lht.address, {from: accounts[0]}).then((r) => {
                            lht.init(lhtProxy.address, {from: accounts[0]}).then((r) => {
                                platform.setProxy(lhtProxy.address, SYMBOL2, {from: accounts[0]}).then((r) => {
                                    lhtProxy.totalSupply(SYMBOL2).then((r) => {
                                        console.log(r);
                                        for(let i = 1; i < 9; i++) {
                                            lhtProxy.transfer(accounts[i], 15, {
                                                from: accounts[0],
                                                gas: 3000000
                                            }).then((r) => {
                                                lhtProxy.balanceOf(accounts[i]).then((r) => {
                                                    console.log(r);
                                                });
                                            }).catch(function (e) {
                                                console.error(e);
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            }).catch(function (e) {
                console.error(e);
            });
        });


        //console.log(chronoMint);
        //console.log(platform);

        chronoMint.addKey(accounts[1], {from: accounts[0], gas: 3000000});
        //chronoMint.addKey(accounts[2], {from: accounts[0], gas: 3000000});
        for(let i = 3; i < 9; i++) {
            chronoMint.proposeLOC(
                    `LOC ${i - 2}`,
                    1000,
                    'mTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB',
                    1484554656, {
                        from: accounts[0],
                        gas: 3000000
                    }).then((r) => {
                        //chronoMint.approveContract(r.address, {from: accounts[1], gas: 3000000});
                        //chronoMint.approveContract(r.address, {from: accounts[2], gas: 3000000});
                    }).catch(function (e) {
                        console.error(e);
                    });
        }

        localStorage.setItem('setupLoc', true);
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
