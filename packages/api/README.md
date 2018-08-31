                                                         | TYPE | MAIN | TEST |
api.etherscan.io                                         | H W  |  Y   |      |
api.myetherapi.com                                       | H W  |  Y   |      |
backend.chronobank.io                                    | H W  |  Y   |      |
backend.profile.tp.ntr1x.com                             | H W  |  Y   |      |
bcc.blockdozer.com                                       | H W  |  Y   |      |
bitcoincash.blockexplorer.com                            | H W  |  Y   |      |
blockexplorer.com                                        | H W  |  Y   |      |
btgexplorer.com                                          | H W  |  Y   |      |
chain.so                                                 | H W  |  Y   |      |
etherscan.io                                             | H W  |  Y   |      |
explorer.bitcoingold.org                                 | H W  |  Y   |      |
live.blockcypher.com                                     | H W  |  Y   |      |
mainnet-full-parity-rpc.chronobank.io                    | H W  |  Y   |      |
mainnet.infura.io                                        | H W  |  Y   |      |
mew.giveth.io                                            | H W  |  Y   |      |
middleware-bitcoin-mainnet-rest.chronobank.io            | H W  |  Y   |      |
middleware-ethereum-mainnet-rest.chronobank.io           | H W  |  Y   |      |
middleware-ethereum-testnet-rest.chronobank.io           | H W  |      |  Y   |
middleware-litecoin-mainnet-rest.chronobank.io           | H W  |  Y   |      |
middleware-litecoin-testnet-rest.chronobank.io           | H W  |      |  Y   |
middleware-nem-mainnet-rest.chronobank.io                | H W  |  Y   |      |
middleware-nem-testnet-rest.chronobank.io                | H W  |      |  Y   |
middleware-testnet-internal-bitcoin-rest.chronobank.io   | H W  |      |  Y   |
middleware-waves-mainnet-rest.chronobank.io              | H W  |  Y   |      |
middleware-waves-testnet-rest.chronobank.io              | H W  |      |  Y   |
min-api.cryptocompare.com                                | H W  |  Y   |      |
rabbitmq-webstomp.chronobank.io                          | H W  |  Y   |  Y   |
rinkeby-full-geth-rpc.chronobank.io                      | H W  |  Y   |      |
rinkeby.etherscan.io                                     | H W  |  Y   |      |
rinkeby.infura.io                                        | H W  |      |  Y   |
streamer.cryptocompare.com                               | H W  |  Y   |      |
tbcc.blockdozer.com                                      | H W  |  Y   |      |
test-explorer.bitcoingold.org                            | H W  |  Y   |      |
test-insight.bitpay.com                                  | H W  |  Y   |      |



Mainnet:
  REST:
    Waves:
      Host: middleware-waves-mainnet-rest.chronobank.io
      Path: /
      Protocol: https
    Nem:
      Host: middleware-nem-mainnet-rest.chronobank.io
      Path: /
      Protocol: https
    Ethereum:
      Host: middleware-ethereum-mainnet-rest.chronobank.io
      Path: /
      Protocol: https
    Bitcoin:
      Host: middleware-bitcoin-mainnet-rest.chronobank.io
      Path: /
      Protocol: https
    Bitcoin Cash:
      Host: bitcoincash.blockexplorer.com
      Path: api
      Protocol: https
    Bitcoin Gold:
      Host: explorer.bitcoingold.org
      Path: insight-api
      Protocol: https
    Litecoin:
      Host: middleware-litecoin-mainnet-rest.chronobank.io
      Path: /
      Protocol: https
  WS:
    Nem:
      Host: rabbitmq-webstomp.chronobank.io
      Path: stomp
      Protocol: https
      user: rabbitmq_user
      password: 38309100024
      channels:
        balance: /exchange/events/mainnet-nem-middleware-02-chronobank-io_balance
        transaction: /exchange/events/mainnet-nem-middleware-02-chronobank-io_transaction
    Ethereum:
      Host: rabbitmq-webstomp.chronobank.io
      Path: stomp
      Protocol: https
      user: rabbitmq_user
      password: 38309100024
      channels:
        balance: /exchange/events/mainnet-ethereum-middleware-chronobank-io_balance
        events: /exchange/events/mainnet-ethereum-parity-middleware-chronobank-io_chrono_sc
    Bitcoin:
      Host: rabbitmq-webstomp.chronobank.io
      Path: stomp
      Protocol: https
      user: rabbitmq_user
      password: 38309100024
      channels:
        balance: /exchange/events/mainnet-bitcoin-middleware-chronobank-io_balance
        block: /exchange/events/mainnet-bitcoin-middleware-chronobank-io_block
    Litecoin:
      Host: rabbitmq-webstomp.chronobank.io
      Path: stomp
      Protocol: https
      user: rabbitmq_user
      password: 38309100024
      channels:
        balance: /exchange/events/mainnet-litecoin-middleware-chronobank-io_balance
        block: /exchange/events/mainnet-litecoin-middleware-chronobank-io_block

Testnet:
  REST:
    Waves:
      Host: middleware-waves-testnet-rest.chronobank.io
      Path: /
      Protocol: https
    Nem:
      Host: middleware-nem-testnet-rest.chronobank.io
      Path: /
      Protocol: https
    Ethereum
      Host: middleware-ethereum-testnet-rest.chronobank.io
      Path: /
      Protocol: https
    Bitcoin
      Host: middleware-testnet-internal-bitcoin-rest.chronobank.io
      Path: /
      Protocol: https
    Bitcoin Cash
      Host: tbcc.blockdozer.com
      Path: insight-api
      Protocol: https
    Bitcoin Gold
      Host: test-explorer.bitcoingold.org
      Path: insight-api
      Protocol: https
    Litecoin
      Host: middleware-litecoin-testnet-rest.chronobank.io
      Path: /
      Protocol: https
  WS
    Nem
      Host: rabbitmq-webstomp.chronobank.io
      Path: stomp
      Protocol: https
      user: rabbitmq_user
      password: 38309100024
      channels: {
        balance: /exchange/events/testnet-nem-middleware-02-chronobank-io_balance
        transaction: /exchange/events/testnet-nem-middleware-02-chronobank-io_transaction
      }
    Ethereum
      Host: rabbitmq-webstomp.chronobank.io
      Path: stomp
      Protocol: https
      user: rabbitmq_user
      password: 38309100024
      channels: {
        balance: /exchange/events/rinkeby-ethereum-middleware-chronobank-io_balance
        events: /exchange/events/rinkeby-ethereum-middleware-chronobank-io_chrono_sc
      }
    Bitcoin
      Host: rabbitmq-webstomp.chronobank.io
      Path: stomp
      Protocol: https
      user: rabbitmq_user
      password: 38309100024
      channels: {
        balance: /exchange/events/internal-testnet-bitcoin-middleware-chronobank-io_balance
        transaction: /exchange/events/internal-testnet-bitcoin-middleware-chronobank-io_transaction
        block: /exchange/events/internal-testnet-bitcoin-middleware-chronobank-io_block
      }
    Litecoin
      Host: rabbitmq-webstomp.chronobank.io
      Path: stomp
      Protocol: https
      user: rabbitmq_user
      password: 38309100024
      channels: {
        balance: /exchange/events/mainnet-litecoin-middleware-chronobank-io_balance
        block: /exchange/events/mainnet-litecoin-middleware-chronobank-io_block
      }

Block Explorers
  Mainnet
    Etherscan_1
      Host: etherscan.io
      Path: tx
      Protocol: https
    Etherscan_2
      Host: api.etherscan.io
      Path: /
      Protocol: https
    Bitcoin
      Host: blockexplorer.com
      Path: tx
      Protocol: https
    Bitcoin Cash
      Host: bcc.blockdozer.com
      Path: insight/tx
      Protocol: https
    Bitcoin Gold
      Host: btgexplorer.com
      Path: tx
      Protocol: https
    Litecoin
      Host: live.blockcypher.com
      Path: ltc/tx
      Protocol: https
  Testnet
    Etherscan_1
      Host: rinkeby.etherscan.io
      Path: tx
      Protocol: https
    Etherscan_2
      Host: rinkeby.etherscan.io
      Path: /
      Protocol: https
    Bitcoin
      Host: live.blockcypher.com
      Path: btc-testnet/tx
      Protocol: https
    Bitcoin Cash
      Host: tbcc.blockdozer.com
      Path: insight/tx
      Protocol: https
    Bitcoin Gold
      Host:
      Path:
      Protocol:
    Litecoin
      Host: chain.so
      Path: tx/LTCTEST
      Protocol: https

Infura
  Mainnet
    REST
      Host: mainnet.infura.io
      Path: PVe9zSjxTKIP3eAuAHFA
      Protocol: https
    WS
      Host: mainnet.infura.io
      Path: ws
      Protocol: wss
  Testnet
    REST
      Host: rinkeby.infura.io
      Path: PVe9zSjxTKIP3eAuAHFA
      Protocol: https
    WS
      Host: rinkeby.infura.io
      Path: ws
      Protocol: wss

Parity
  Mainnet
    REST
      Host: mainnet-full-parity-rpc.chronobank.io
      Path: /
      Protocol: https
    WS
      Host: mainnet-full-parity-rpc.chronobank.io
      Path: /
      Protocol: wss
  Testnet
    REST
      Host: rinkeby-full-geth-rpc.chronobank.io
      Path: /
      Protocol: https
    WS
      Host: rinkeby-full-geth-rpc.chronobank.io
      Path: /
      Protocol: wss

External
  REST
    Cryptocompare
      Host: min-api.cryptocompare.com
      Path: data/pricemulti
      Protocol: https
    ProfileService
      Host: backend.profile.tp.ntr1x.com
      Path: api/v1
      Protocol: https
    ProfileService_1
      Host: backend.chronobank.io
      Path: api/v1
      Protocol: https
    Ledger
      Host: test-insight.bitpay.com
      Path: api
      Protocol: https
    MyEtherApi
      Host: api.myetherapi.com
      Path: eth
      Protocol: https
    GiveEth
      Host: mew.giveth.io
      Path: eth
      Protocol: https
  WS
    Cryptocompare
      Host: streamer.cryptocompare.com
      Path: data/pricemulti
      Protocol: https
