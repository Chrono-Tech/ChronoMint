import Immutable from 'immutable'
import TokenModel from 'models/TokenModel'
import TxModel from 'models/TxModel'
import MultisigWalletPendingTxCollection from 'models/Wallet/MultisigWalletPendingTxCollection'
import MultisigWalletPendingTxModel from 'models/Wallet/MultisigWalletPendingTxModel'
import TransactionsCollection from 'models/Wallet/TransactionsCollection'
import MultisigWalletModel from './MultisigWalletModel'

const multisigWalletModel = new MultisigWalletModel({
  address: 'a1',
  tokens: new Immutable.Map({
    t1: new TokenModel({
      symbol: 'TK1',
    }),
    t2: new TokenModel({
      symbol: 'TK2',
    }),
  }),
  transactions: new TransactionsCollection({
    list: new Immutable.Map({
      tx1: new TxModel({
        txHash: 'hash1',
      }),
      tx2: new TxModel({
        txHash: 'hash2',
      }),
    }),
  }),
  owners: new Immutable.List([ 'owner1', 'owner2' ]),
  name: 'Wallet Name',
  requiredSignatures: 2,
  pendingTxList: new MultisigWalletPendingTxCollection({
    list: new Immutable.Map({
      tx1: new MultisigWalletPendingTxModel({ id: 'tx1' }),
      tx2: new MultisigWalletPendingTxModel({ id: 'tx2' }),
    }),
  }),
})

describe('Multisig Wallet Model', () => {
  it('should create new model', () => {
    expect(multisigWalletModel).toMatchSnapshot()
  })

  it('should get id as hash', () => {
    const model = new MultisigWalletModel({
      address: 'a1',
      transactionHash: 'hash1',
    })
    expect(model.id()).toEqual('hash1')
  })

  it('should get id as address', () => {
    const model = new MultisigWalletModel({
      address: 'a1',
    })
    expect(model.id()).toEqual('a1')
  })
})
