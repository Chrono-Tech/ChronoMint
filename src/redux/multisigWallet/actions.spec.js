import BigNumber from 'bignumber.js'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'
import type MultisigWalletDAO from 'dao/MultisigWalletDAO'
import Immutable from 'immutable'
import MultisigTransactionModel from 'models/wallet/MultisigTransactionModel'
import MultisigWalletCollection from 'models/wallet/MultisigWalletCollection'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import multisigWalletService from 'services/MultisigWalletService'
import { accounts, mockStore } from 'specsInit'
import * as a from './actions'

const walletModel = new MultisigWalletModel({
  owners: new Immutable.List([
    accounts[ 0 ],
    accounts[ 1 ],
  ]),
  requiredSignatures: 2,
})

const get = (wallet) => (duck) => {
  switch (duck) {
    case a.DUCK_MULTISIG_WALLET:
      return new MultisigWalletCollection(wallet)
  }
}

const store = mockStore({ get: get() })

describe('Multisig Wallet actions', () => {
  // TODO @dkchv: update fetching flow
  it.skip('should create multisig wallet', async (done) => {
    let walletSizeBefore

    const dao = await contractsManagerDAO.getWalletsManagerDAO()
    await dao.watchWalletCreate(async (wallet: MultisigWalletModel) => {
      // 3 created
      expect(wallet.address()).not.toBeNull()
      const wallets = await store.dispatch(a.getWallets())
      expect(wallets.size).toEqual(walletSizeBefore + 1)

      // 4 clean up
      await multisigWalletService.unsubscribe(wallet.address())
      done()
    })
    // 1 get wallet and subscribe
    const wallets = await store.dispatch(a.getWallets())
    walletSizeBefore = wallets.size

    // 2 create
    const txHash = await store.dispatch(a.createWallet(walletModel))
    expect(txHash).not.toBeNull()
  })

  it('should deposit ETH tokens', async (done) => {
    const amountToTransfer = new BigNumber(1.1)
    const manager = await contractsManagerDAO.getWalletsManagerDAO()
    const wallets = await manager.getWallets()
    expect(wallets.size).toEqual(1)
    const wallet = wallets.first()

    multisigWalletService.on('Deposit', async (walletId, tokenId, amount) => {
      // 3 deposited
      expect(walletId).toEqual(wallet.address())
      expect(tokenId).toEqual('ETH')
      expect(amount).toEqual(amountToTransfer)
      // 4 clean up
      await multisigWalletService.unsubscribe(walletId)
      done()
    })
    // 1 subscribe on wallet
    await store.dispatch(a.watchMultisigWallet(wallet))
    // 2 transfer
    await ethereumDAO.transfer(wallet.address(), amountToTransfer)
  })

  it('should send ETH with multisig transfer', async (done) => {
    const amountToMSTransfer = new BigNumber(1)

    const manager = await contractsManagerDAO.getWalletsManagerDAO()
    const wallets = await manager.getWallets()
    const wallet = wallets.first()
    expect(wallets.size).toEqual(1)
    expect(wallet.address()).not.toBeNull()

    multisigWalletService.on('ConfirmationNeeded', async (walletId, pendingTxModel) => {
      expect(pendingTxModel.id()).not.toBeNull()
      expect(walletId).toEqual(wallet.address())

      const dao: MultisigWalletDAO = await multisigWalletService.getWalletDAO(walletId)
      // 4.1 confirm from second account
      dao.setAccount(accounts[ 1 ])
      await store.dispatch(a.confirmMultisigTx(wallet, pendingTxModel))
      // 4.2 revert to first
      dao.setAccount(accounts[ 0 ])
    })

    multisigWalletService.on('MultiTransact', async (walletId, multisigTransactionModel: MultisigTransactionModel) => {
      // 5 sended
      expect(multisigTransactionModel.value()).toEqual(amountToMSTransfer)
      expect(multisigTransactionModel.symbol()).toEqual('ETH')
      expect(multisigTransactionModel.wallet()).toEqual(wallet.address())
      expect(walletId).toEqual(wallet.address())

      // 6 clean up
      await multisigWalletService.unsubscribe(wallet.address())
      done()
    })

    await store.dispatch(a.watchMultisigWallet(wallet))
    // 3 send back
    const token = wallet.tokens().get('ETH')
    await store.dispatch(a.multisigTransfer(wallet, token, amountToMSTransfer, accounts[ 0 ]))
  })

  it.skip('should add owner to wallet', async (done) => {
    const amountToMSTransfer = new BigNumber(1)
    const manager = await contractsManagerDAO.getWalletsManagerDAO()
    const wallets = await manager.getWallets()
    expect(wallets.size).toEqual(1)
    const wallet = wallets.first()
    expect(wallet.address()).not.toBeNull()

    multisigWalletService.on('MultiTransact', async (walletId, multisigTransactionModel: MultisigTransactionModel) => {
      // 5 sended
      expect(multisigTransactionModel.value()).toEqual(amountToMSTransfer)
      expect(multisigTransactionModel.symbol()).toEqual('ETH')
      expect(multisigTransactionModel.wallet()).toEqual(wallet.address())
      expect(walletId).toEqual(wallet.address())

      // 6 clean up
      await multisigWalletService.unsubscribe(wallet.address())
      done()
    })
  })
})
