import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from '@chronobank/login/network/BitcoinProvider'

export default {
  [BLOCKCHAIN_BITCOIN]: {
    transfer: {
      title: 'Перевод BTC',
    },
  },
  [BLOCKCHAIN_BITCOIN_CASH]: {
    transfer: {
      title: 'Перевод BCC',
    },
  },
  [BLOCKCHAIN_BITCOIN_GOLD]: {
    transfer: {
      title: 'Перевод BTG',
    },
  },
  [BLOCKCHAIN_LITECOIN]: {
    transfer: {
      title: 'Перевод LTC',
    },
  },
}
