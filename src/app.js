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
import ChronoBankAssetWithFeeProxy from './contracts/ChronoBankAssetWithFeeProxy.sol';
import EventsHistory from './contracts/EventsHistory.sol';
import ChronoBankPlatformEmitter from './contracts/ChronoBankPlatformEmitter.sol'
import './styles.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';
import Web3 from 'web3';
import truffleConfig from '../truffle.js'
import bytes32 from './bytes32';
import {getLOCS} from 'redux/ducks/locs';

var hostname = (truffleConfig.rpc.host === '0.0.0.0') ? window.location.hostname : truffleConfig.rpc.host;
const web3Location = `http://${hostname}:${truffleConfig.rpc.port}`;

class App {
    constructor() {
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
///////////////////////
//         getLOCS(localStorage.chronoBankAccount, this.chronoMint, (r)=>{
//             console.log(r);
//         });
///////////////////////////////
        this.platformEmitter = ChronoBankPlatformEmitter.deployed();
        const fakeArgs = [0,0,0,0,0,0,0,0];
        console.log(this.platformEmitter.contract.emitTransfer.getData.apply(this, fakeArgs).slice(0, 10));
        console.log(this.platformEmitter.contract.emitIssue.getData.apply(this, fakeArgs).slice(0, 10));
        console.log(this.platformEmitter.contract.emitRevoke.getData.apply(this, fakeArgs).slice(0, 10));
        console.log(this.platformEmitter.contract.emitOwnershipChange.getData.apply(this, fakeArgs).slice(0, 10));
        console.log(this.platformEmitter.contract.emitApprove.getData.apply(this, fakeArgs).slice(0, 10));
        console.log(this.platformEmitter.contract.emitRecovery.getData.apply(this, fakeArgs).slice(0, 10));

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

        platform.setupEventsHistory(eventsHistory.address,{from: accounts[0]}).then((r) => {
            eventsHistory.addEmitter('0x515c1457', platformEmitter.address,{from: accounts[0]}).then((r) => {
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
                                                    console.log(r);
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
                })

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
        })


        //console.log(chronoMint);
        //console.log(platform);

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
                    }
            ).then((r) => {
                chronoMint.approveContract(r.address, {from: accounts[1], gas: 3000000});
                chronoMint.approveContract(r.address, {from: accounts[2], gas: 3000000});
            }).catch(function (e) {
                console.error(e);
            });
        }
        debugger;
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