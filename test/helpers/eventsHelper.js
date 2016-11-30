function EventsHelper() {
  var allEventsWatcher = undefined;

  var waitReceipt = function(transactionHash, address) {
    return new Promise(function(resolve, reject) {
      var transactionCheck = function() {
        var receipt = web3.eth.getTransactionReceipt(transactionHash);
        if (receipt) {
          var count = 0;
          if (address) {
            receipt.logs.forEach(function(log) {
              count += log.address === address ? 1 : 0;
            });
          } else {
            count = receipt.logs.length;
          }
          return resolve(count);
        } else {
          setTimeout(transactionCheck, 100);
        }
      };
      transactionCheck();
    });
  };

  var waitEvents = function(watcher, count) {
    return new Promise(function(resolve, reject) {
      var transactionCheck = function() {
        watcher.get(function(err, events) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          if (events) {
            if (events.length == count) {
              return resolve(events);
            }
            if (events.length > count) {
              console.log(events);
              return reject("Filter produced " + events.length + " events, while receipt produced only " + count + " logs.");
            }
          }
          setTimeout(transactionCheck, 100);
        });
      };
      transactionCheck();
    });
  };

  this.getEvents = function(transactionHash, watcher) {
    if (allEventsWatcher === undefined) {
      throw "Call setupEvents before target transaction send."
    }
    return new Promise(function(resolve, reject) {
      waitReceipt(transactionHash, watcher.options.address).then(function(logsCount) {
        return waitEvents(allEventsWatcher, logsCount);
      }).then(function() {
        watcher.get(function(err, events) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          return resolve(events);
        });
      });
    });
  };

  this.setupEvents = function(contract) {
    allEventsWatcher = contract.allEvents();
  }
};

module.exports = new EventsHelper();