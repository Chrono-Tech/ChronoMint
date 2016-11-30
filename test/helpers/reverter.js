var http = require('http');

function Reverter(web3) {
  var snapshotId;

  this.revert = (done) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_revert",
      id: new Date().getTime(),
      params: [snapshotId]
    }, (err, result) => {
      if (err) {
        done(err);
      }
      else {
        this.snapshot(done);
      }
    });
  };

  this.snapshot = (done) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_snapshot",
      id: new Date().getTime()
    }, (err, result) => {
      if (err) {
        done(err);
      }
      else {
        snapshotId = web3.toDecimal(result.result);
        done();
      }
    });
  };
}

module.exports = Reverter;
