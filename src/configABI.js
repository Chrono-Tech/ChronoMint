module.exports = {
    approve_gas:150000, //set on every transaction
    send_gas:200000, //set on every transaction
    exchange_gas:250000, //set on every transaction
    contractAddresses: ['0x99f7c94e7d2ef4ff5efc66d56522a8b7e4284501', '0x44815af1a9deac7f2152a81de4143ef070440fd2', '0x0326ac5b3659aa5aecde5808931a59a6d8f6f51f'],
    //Order Matters!!!
    fiat: ['USD', 'EUR', 'AUD', 'GBP'],
    fee: [0.0015, 0.0015, 0.0015, 0.0015],
    //this is growth ratio per day
    fiatRatio: ['0.00169863013', '0.00043835616', '0.00175342465', '0.00076712328'],
    fiatStartRate: [25.27, 11.30, 31.32, 12.62],

    //Contract abi is common for every contract
    contractABI: [{
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "commitUpgrade",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getLatestVersion",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {
            "name": "_spender",
            "type": "address"
        }, {"name": "_value", "type": "uint256"}],
        "name": "emitApprove",
        "outputs": [],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {
            "name": "_to",
            "type": "address"
        }, {"name": "_value", "type": "uint256"}],
        "name": "transferFrom",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {
            "name": "_to",
            "type": "address"
        }, {"name": "_value", "type": "uint256"}],
        "name": "emitTransfer",
        "outputs": [],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "chronoBankPlatform",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getPendingVersionTimestamp",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "purgeUpgrade",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "optIn",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {
            "name": "_to",
            "type": "address"
        }, {"name": "_value", "type": "uint256"}, {"name": "_reference", "type": "string"}],
        "name": "transferFromWithReference",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }, {"name": "_reference", "type": "string"}, {"name": "_sender", "type": "address"}],
        "name": "__transferWithReference",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_spender", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }, {"name": "_sender", "type": "address"}],
        "name": "__approve",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "bytes32"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getPendingVersion",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }, {"name": "_reference", "type": "string"}],
        "name": "transferWithReference",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_newVersion", "type": "address"}],
        "name": "proposeUpgrade",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "optOut",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_chronoBankPlatform", "type": "address"}, {
            "name": "_symbol",
            "type": "bytes32"
        }, {"name": "_name", "type": "string"}],
        "name": "init",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_from", "type": "address"}, {"name": "_spender", "type": "address"}],
        "name": "allowance",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {
            "name": "_to",
            "type": "address"
        }, {"name": "_value", "type": "uint256"}, {
            "name": "_reference",
            "type": "string"
        }, {"name": "_sender", "type": "address"}],
        "name": "__transferFromWithReference",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_sender", "type": "address"}],
        "name": "getVersionFor",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {"payable": true, "type": "fallback"}, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "from", "type": "address"}, {
            "indexed": true,
            "name": "to",
            "type": "address"
        }, {"indexed": false, "name": "value", "type": "uint256"}],
        "name": "Transfer",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "from", "type": "address"}, {
            "indexed": true,
            "name": "spender",
            "type": "address"
        }, {"indexed": false, "name": "value", "type": "uint256"}],
        "name": "Approve",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "newVersion", "type": "address"}],
        "name": "UpgradeProposal",
        "type": "event"
    }],

    exchangeContract: ['0xf087da190c89fbc7d540daaa2f1d6a68d338fef0'], //LHUS
    exchangeABI: [{
        "constant": false,
        "inputs": [{"name": "_buyPrice", "type": "uint256"}, {
            "name": "_sellPrice",
            "type": "uint256"
        }],
        "name": "setPrices",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_recipient", "type": "address"}, {
            "name": "_amount",
            "type": "uint256"
        }],
        "name": "withdrawTokens",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_asset", "type": "address"}],
        "name": "init",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_recipient", "type": "address"}, {
            "name": "_amount",
            "type": "uint256"
        }],
        "name": "withdrawEth",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "asset",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "claimContractOwnership",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "sellPrice",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}],
        "name": "changeContractOwnership",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "pendingContractOwner",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "buyPrice",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_recipient", "type": "address"}],
        "name": "withdrawAllTokens",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "contractOwner",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_recipient", "type": "address"}],
        "name": "withdrawAllEth",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_amount", "type": "uint256"}, {"name": "_price", "type": "uint256"}],
        "name": "buy",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": true,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_amount", "type": "uint256"}, {"name": "_price", "type": "uint256"}],
        "name": "sell",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_recipient", "type": "address"}],
        "name": "withdrawAll",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {"payable": true, "type": "fallback"}, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_who", "type": "address"}, {
            "indexed": false,
            "name": "_token",
            "type": "uint256"
        }, {"indexed": false, "name": "_eth", "type": "uint256"}],
        "name": "Sell",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_who", "type": "address"}, {
            "indexed": false,
            "name": "_token",
            "type": "uint256"
        }, {"indexed": false, "name": "_eth", "type": "uint256"}],
        "name": "Buy",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_recipient", "type": "address"}, {
            "indexed": false,
            "name": "_amount",
            "type": "uint256"
        }],
        "name": "WithdrawTokens",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_recipient", "type": "address"}, {
            "indexed": false,
            "name": "_amount",
            "type": "uint256"
        }],
        "name": "WithdrawEth",
        "type": "event"
    }]
};