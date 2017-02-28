var Vote = artifacts.require("./Vote.sol");
var Reverter = require('./helpers/reverter');
var bytes32 = require('./helpers/bytes32');
var exec = require('sync-exec');
contract('Vote', function(accounts) {
    var owner = accounts[0];
    const SYMBOL = 'TIME';
    exec('truffle exec ./setup/4_setup_assets.js')

    before('setup', function(done) {
        Vote.deployed().then(function(instance) {
            vote = instance; });
        done();
    });
 
    context("before", function() {
        it("Platform has correct TIME proxy address.", function() {
            return platform.proxies.call(SYMBOL).then(function(r) {
                assert.equal(r,timeProxyContract.address);
            });
        });

          it("TIME contract has correct TIME proxy address.", function() {
             return timeContract.proxy.call().then(function(r) {
                 assert.equal(r,timeProxyContract.address);
               });
    });

        it("TIME proxy has right version", function() {
            return timeProxyContract.getLatestVersion.call().then(function(r) {
                assert.equal(r,timeContract.address);
            });
        });

    });

    context("shares deposit", function(){

        it("check Owner has 100 TIME", function() {
            return timeProxyContract.balanceOf.call(owner).then(function(r) {
                console.log(r);
                assert.equal(r,100);
            });
        });
    });

    context("voting", function(){

    });

    context("shares withdraw", function(){

    });

})

