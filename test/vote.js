var Vote = artifacts.require("./Vote.sol");
var Reverter = require('./helpers/reverter');
var bytes32 = require('./helpers/bytes32');
contract('Vote', function(accounts) {
    var owner = accounts[0];

    before('setup', function(done) {
        Vote.deployed().then(function(instance) {
            vote = instance; });
        done();
    });

    context("shares deposit", function(){
        it("check Owner has 100 TIME", function() {
            return timeProxyContract.balanceOf.call(owner).then(function(r) {
                console.log(timeProxyContract.address);
                assert.equal(r,100);
            });
        });
    });

    context("voting", function(){

    });

    context("shares withdraw", function(){

    });

})

