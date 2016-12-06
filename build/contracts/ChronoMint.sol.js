var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("ChronoMint error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("ChronoMint error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("ChronoMint contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of ChronoMint: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to ChronoMint.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: ChronoMint not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "2": {
    "abi": [
      {
        "constant": true,
        "inputs": [],
        "name": "liquidityPercentage",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "pendingAuthorizedKeys",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "rewardsContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "lhContracts",
        "outputs": [
          {
            "name": "currency",
            "type": "string"
          },
          {
            "name": "rate",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "authorizedKeys",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_tc",
            "type": "address"
          }
        ],
        "name": "setTimeContract",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "claimauthorizedKeyship",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "insurancePercentage",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "insuranceDuration",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          },
          {
            "name": "_data",
            "type": "bytes"
          }
        ],
        "name": "forwardCall",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "LHContractsCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "timeContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "offeringCompanies",
        "outputs": [
          {
            "name": "index",
            "type": "uint256"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "website",
            "type": "string"
          },
          {
            "name": "status",
            "type": "uint8"
          },
          {
            "name": "controller",
            "type": "address"
          },
          {
            "name": "issueLimit",
            "type": "uint256"
          },
          {
            "name": "redeemed",
            "type": "uint256"
          },
          {
            "name": "publishedHash",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "key",
            "type": "address"
          }
        ],
        "name": "revokeAuthorization",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "LOCCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_website",
            "type": "string"
          },
          {
            "name": "_status",
            "type": "uint8"
          },
          {
            "name": "_controller",
            "type": "address"
          },
          {
            "name": "_issueLimit",
            "type": "uint256"
          },
          {
            "name": "_redeemed",
            "type": "uint256"
          },
          {
            "name": "_publishedHash",
            "type": "string"
          }
        ],
        "name": "addLOC",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_rc",
            "type": "address"
          }
        ],
        "name": "setRewardsContract",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "securityPercentage",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "key",
            "type": "address"
          }
        ],
        "name": "isAuthorized",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_tc",
            "type": "address"
          },
          {
            "name": "_rc",
            "type": "address"
          }
        ],
        "type": "constructor"
      },
      {
        "payable": false,
        "type": "fallback"
      }
    ],
    "unlinked_binary": "0x6060604081815280610ba0833960a081529051608051600160a060020a03331660009081526020819052928320805460ff19166001179055600480546c01000000000000000000000000938402849004600160a060020a03199182161790915560058054928402939093049116179055610b2290819061007e90396000f3606060405236156100e55760e060020a6000350463048b87ba81146100f25780630865099a14610100578063220cce9714610120578063343828d2146101375780633a0daf37146101585780633d466288146101785780633fc192ac146101935780634098a2a6146101c8578063502b82c9146101d65780636effec50146101e45780637203ff71146102405780638116db9a1461024e578063ad5f2d3814610265578063b48028e3146102ba578063bc684246146102d0578063c167b7df146102de578063dfa0dfa5146103c4578063f3c070f7146103d8578063fe9fbb80146103e6575b34610002576103f6610002565b34610002576103f860075481565b346100025761040a60043560016020526000908152604090205460ff1681565b346100025761041e600554600160a060020a031681565b346100025761043a600435600a602052600090815260409020600181015482565b346100025761040a60043560006020819052908152604090205460ff1681565b34610002576103f6600435610677335b6000610ac433610188565b346100025761040a600160a060020a033316600090815260016020819052604082205460ff161515146106a7575060006106de565b34610002576103f860085481565b34610002576103f860095481565b3461000257604080516020600460443581810135601f810184900484028501840190955284845261040a94823594602480359560649492939190920191819084018382808284375094965050505050505060006106e133610188565b34610002576103f860025481565b346100025761041e600454600160a060020a031681565b3461000257600b60205260048035600090815260409020805460038201549282015460058301546104ca9492936001810193600282019360ff821693610100909204600160a060020a03169290919060060188565b346100025761040a600435600061076e33610188565b34610002576103f860035481565b34610002576103f66004808035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843750506040805160208835808b0135601f81018390048302840183019094528383529799986044989297509190910194509092508291508401838280828437505060408051602060c435808b0135601f8101839004830284018301909452838352979998359860643598608435985060a435975090955060e494509192602492909201919081908401838280828437509496505050505050506107e833610188565b34610002576103f6600435610a9333610188565b34610002576103f860065481565b346100025761040a600435610188565b005b60408051918252519081900360200190f35b604080519115158252519081900360200190f35b60408051600160a060020a039092168252519081900360200190f35b60408051602081018390528181528354600260001961010060018416150201909116049181018290529081906060820190859080156104ba5780601f1061048f576101008083540402835291602001916104ba565b820191906000526020600020905b81548152906001019060200180831161049d57829003601f168201915b5050935050505060405180910390f35b6040805189815260608101879052600160a060020a038616608082015260a0810185905260c08101849052610100602082018181528a546002600019600183161585020190911604918301829052919283019060e08401906101208501908c9080156105775780601f1061054c57610100808354040283529160200191610577565b820191906000526020600020905b81548152906001019060200180831161055a57829003601f168201915b505084810383528a54600260001961010060018416150201909116048082526020909101908b9080156105eb5780601f106105c0576101008083540402835291602001916105eb565b820191906000526020600020905b8154815290600101906020018083116105ce57829003601f168201915b505084810382528554600260001961010060018416150201909116048082526020909101908690801561065f5780601f106106345761010080835404028352916020019161065f565b820191906000526020600020905b81548152906001019060200180831161064257829003601f168201915b50509b50505050505050505050505060405180910390f35b156106a4576004805473ffffffffffffffffffffffffffffffffffffffff1916606060020a838102041790555b50565b5033600160a060020a03166000908152602081815260408083208054600160ff199182168117909255928190529220805490911690555b90565b156107675783600160a060020a03168383604051808280519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561073f5780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876185025a03f192505050151561076357610002565b5060015b9392505050565b156107e357600160a060020a03821660009081526020819052604090205460ff16151560011480156107b2575033600160a060020a031682600160a060020a031614155b156107df5750600160a060020a0381166000908152602081905260409020805460ff1916905560016107e3565b5060005b919050565b156108d65761010060405190810160405280600360005054815260200188815260200187815260200186815260200185815260200184815260200183815260200182815260200150600b60005060006003600050548152602001908152602001600020600050600082015181600001600050556020820151816001016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106108df57805160ff19168380011785555b5061090f9291505b8082111561096e57600081556001016108b4565b505060038054600101905550505b50505050505050565b828001600101855582156108ac579182015b828111156108ac5782518260005055916020019190600101906108f1565b50506040820151816002016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061097257805160ff19168380011785555b506109a29291506108b4565b5090565b82800160010185558215610962579182015b82811115610962578251826000505591602001919060010190610984565b505060608201516003820180546080850151606060020a9081020461010090810274ffffffffffffffffffffffffffffffffffffffff001960f860020a9586029590950460ff19909316929092179390931617905560a0830151600483015560c0830151600583015560e0830151805160068401805460008281526020908190209295601f60026001851615909202600019019093160482018190048301940190839010610a6357805160ff19168380011785555b506108c89291506108b4565b82800160010185558215610a57579182015b82811115610a57578251826000505591602001919060010190610a75565b156106a4576005805473ffffffffffffffffffffffffffffffffffffffff1916606060020a838102041790556106a4565b156107e357600160a060020a03821660009081526020819052604090205460ff16151560011415610af7575060006107e3565b50600160a060020a0381166000908152600160208190526040909120805460ff1916821790556107e356",
    "events": {},
    "updated_at": 1480723923359,
    "links": {},
    "address": "0x8613d13c1917795b311c8c9034905e475a0a4274"
  },
  "default": {
    "abi": [
      {
        "constant": true,
        "inputs": [],
        "name": "liquidityPercentage",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "pendingAuthorizedKeys",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "rewardsContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "lhContracts",
        "outputs": [
          {
            "name": "currency",
            "type": "string"
          },
          {
            "name": "rate",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "authorizedKeys",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_tc",
            "type": "address"
          }
        ],
        "name": "setTimeContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "claimauthorizedKeyship",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "insurancePercentage",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "insuranceDuration",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "key",
            "type": "address"
          }
        ],
        "name": "addKey",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          },
          {
            "name": "_data",
            "type": "bytes"
          }
        ],
        "name": "forwardCall",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "LHContractsCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "timeContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "offeringCompanies",
        "outputs": [
          {
            "name": "index",
            "type": "uint256"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "website",
            "type": "string"
          },
          {
            "name": "status",
            "type": "uint8"
          },
          {
            "name": "controller",
            "type": "address"
          },
          {
            "name": "issueLimit",
            "type": "uint256"
          },
          {
            "name": "redeemed",
            "type": "uint256"
          },
          {
            "name": "publishedHash",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "key",
            "type": "address"
          }
        ],
        "name": "revokeAuthorization",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "LOCCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_website",
            "type": "string"
          },
          {
            "name": "_status",
            "type": "uint8"
          },
          {
            "name": "_controller",
            "type": "address"
          },
          {
            "name": "_issueLimit",
            "type": "uint256"
          },
          {
            "name": "_redeemed",
            "type": "uint256"
          },
          {
            "name": "_publishedHash",
            "type": "string"
          }
        ],
        "name": "addLOC",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_rc",
            "type": "address"
          }
        ],
        "name": "setRewardsContract",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "securityPercentage",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "key",
            "type": "address"
          }
        ],
        "name": "isAuthorized",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_tc",
            "type": "address"
          },
          {
            "name": "_rc",
            "type": "address"
          }
        ],
        "type": "constructor"
      },
      {
        "payable": false,
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "name",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "val",
            "type": "address"
          }
        ],
        "name": "Log",
        "type": "event"
      }
    ],
    "unlinked_binary": "0x6060604081815280610bfd833960a081529051608051600160a060020a03321660009081526020819052928320805460ff19166001179055600480546c01000000000000000000000000938402849004600160a060020a03199182161790915560058054928402939093049116179055610b7f90819061007e90396000f3606060405236156100f05760e060020a6000350463048b87ba81146100fd5780630865099a1461010b578063220cce971461012b578063343828d2146101425780633a0daf37146101635780633d466288146101835780633fc192ac146101c85780634098a2a6146101fd578063502b82c91461020b5780635f7b68be146102195780636effec50146102595780637203ff71146102b55780638116db9a146102c3578063ad5f2d38146102da578063b48028e31461032f578063bc68424614610345578063c167b7df14610353578063dfa0dfa514610439578063f3c070f714610474578063fe9fbb8014610482575b3461000257610492610002565b346100025761049460075481565b34610002576104a660043560016020526000908152604090205460ff1681565b34610002576104ba600554600160a060020a031681565b34610002576104d6600435600a602052600090815260409020600181015482565b34610002576104a660043560006020819052908152604090205460ff1681565b34610002576104ba60043560048054606060020a8084020473ffffffffffffffffffffffffffffffffffffffff199091161790819055600160a060020a03165b919050565b34610002576104a6600160a060020a033316600090815260016020819052604082205460ff161515146107135750600061074a565b346100025761049460085481565b346100025761049460095481565b34610002576104a6600435600061074d335b600160a060020a03811660009081526020819052604081205460ff16151560011415610b54575060016101c3565b3461000257604080516020600460443581810135601f81018490048402850184019095528484526104a694823594602480359560649492939190920191819084018382808284375094965050505050505060006107a33361022b565b346100025761049460025481565b34610002576104ba600454600160a060020a031681565b3461000257600b60205260048035600090815260409020805460038201549282015460058301546105669492936001810193600282019360ff821693610100909204600160a060020a03169290919060060188565b34610002576104a660043560006108303361022b565b346100025761049460035481565b34610002576104926004808035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843750506040805160208835808b0135601f81018390048302840183019094528383529799986044989297509190910194509092508291508401838280828437505060408051602060c435808b0135601f8101839004830284018301909452838352979998359860643598608435985060a435975090955060e494509192602492909201919081908401838280828437509496505050505050506108a93361022b565b34610002576104a660043560058054606060020a8084020473ffffffffffffffffffffffffffffffffffffffff1990911617905560016101c3565b346100025761049460065481565b34610002576104a660043561022b565b005b60408051918252519081900360200190f35b604080519115158252519081900360200190f35b60408051600160a060020a039092168252519081900360200190f35b60408051602081018390528181528354600260001961010060018416150201909116049181018290529081906060820190859080156105565780601f1061052b57610100808354040283529160200191610556565b820191906000526020600020905b81548152906001019060200180831161053957829003601f168201915b5050935050505060405180910390f35b6040805189815260608101879052600160a060020a038616608082015260a0810185905260c08101849052610100602082018181528a546002600019600183161585020190911604918301829052919283019060e08401906101208501908c9080156106135780601f106105e857610100808354040283529160200191610613565b820191906000526020600020905b8154815290600101906020018083116105f657829003601f168201915b505084810383528a54600260001961010060018416150201909116048082526020909101908b9080156106875780601f1061065c57610100808354040283529160200191610687565b820191906000526020600020905b81548152906001019060200180831161066a57829003601f168201915b50508481038252855460026000196101006001841615020190911604808252602090910190869080156106fb5780601f106106d0576101008083540402835291602001916106fb565b820191906000526020600020905b8154815290600101906020018083116106de57829003601f168201915b50509b50505050505050505050505060405180910390f35b5033600160a060020a03166000908152602081815260408083208054600160ff199182168117909255928190529220805490911690555b90565b1561079e57600160a060020a03331660009081526020819052604090205460ff16151560011461079e57600160a060020a0333166000908152600160208190526040909120805460ff191690911790555b6101c3565b156108295783600160a060020a03168383604051808280519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156108015780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876185025a03f192505050151561082557610002565b5060015b9392505050565b1561079e57600160a060020a03821660009081526020819052604090205460ff1615156001148015610874575033600160a060020a031682600160a060020a031614155b156108a15750600160a060020a0381166000908152602081905260409020805460ff19169055600161079e565b50600061079e565b156109975761010060405190810160405280600360005054815260200188815260200187815260200186815260200185815260200184815260200183815260200182815260200150600b60005060006003600050548152602001908152602001600020600050600082015181600001600050556020820151816001016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106109a057805160ff19168380011785555b506109d09291505b80821115610a2f5760008155600101610975565b505060038054600101905550505b50505050505050565b8280016001018555821561096d579182015b8281111561096d5782518260005055916020019190600101906109b2565b50506040820151816002016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610a3357805160ff19168380011785555b50610a63929150610975565b5090565b82800160010185558215610a23579182015b82811115610a23578251826000505591602001919060010190610a45565b505060608201516003820180546080850151606060020a9081020461010090810274ffffffffffffffffffffffffffffffffffffffff001960f860020a9586029590950460ff19909316929092179390931617905560a0830151600483015560c0830151600583015560e0830151805160068401805460008281526020908190209295601f60026001851615909202600019019093160482018190048301940190839010610b2457805160ff19168380011785555b50610989929150610975565b82800160010185558215610b18579182015b82811115610b18578251826000505591602001919060010190610b36565b50600160a060020a0381166000908152600160208190526040909120805460ff1916821790556101c356",
    "events": {
      "0x1dfffa052d4a63bd70f14b863e128979d1c59e3589a0a3beb2633a120047042d": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "name",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "val",
            "type": "address"
          }
        ],
        "name": "Log",
        "type": "event"
      }
    },
    "updated_at": 1480977794215,
    "links": {},
    "address": "0x5eab0bdf3315606dee1d3033e2d2f241fa6a0dca"
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "ChronoMint";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.ChronoMint = Contract;
  }
})();
