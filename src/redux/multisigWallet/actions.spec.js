import BigNumber from 'bignumber.js'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'
import Immutable from 'immutable'
import MultisigTransactionModel from 'models/Wallet/MultisigTransactionModel'
import MultisigWalletCollection from 'models/Wallet/MultisigWalletCollection'
import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import multisigWalletService from 'services/MultisigWalletService'
import { accounts, mockStore } from 'specsInit'
import * as a from './actions'

const walletModel = new MultisigWalletModel({
  owners: new Immutable.List([
    accounts[0],
    accounts[1],
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
  it.skip('should create multisig wallet', async (done) => {
    let walletSizeBefore

    const dao = await contractsManagerDAO.getWalletsManagerDAO()
    await dao.watchWalletCreate(async (wallet: MultisigWalletModel) => {
      // 3 created
      expect(wallet.address()).not.toBeNull()
      const wallets = await store.dispatch(a.getWallets())
      expect(wallets.size).toEqual(walletSizeBefore + 1)

      // 4 clean up
      // TODO @dkchv: !!!
      done()
    })
    // 1 get wallet and subscribe
    const wallets = await store.dispatch(a.getWallets())
    walletSizeBefore = wallets.size

    // 2 create
    const txHash = await store.dispatch(a.createWallet(walletModel))
    expect(txHash).not.toBeNull()
  })

  it.skip('should deposit ETH tokens', async (done) => {
    const amountToTransfer = new BigNumber(1.1)
    const dao = await contractsManagerDAO.getWalletsManagerDAO()
    await dao.watchWalletCreate(async (wallet: MultisigWalletModel) => {
      multisigWalletService.on('Deposit', async (walletId, tokenId, amount) => {
        // 4 deposited
        expect(walletId).toEqual(wallet.address())
        expect(tokenId).toEqual('ETH')
        expect(amount).toEqual(amountToTransfer)

        // 5 clean up
        await multisigWalletService.unsubscribeAll()
        done()
      })
      // 2 subscribe on wallet
      await store.dispatch(a.watchMultisigWallet(wallet))
      // 3 transfer
      await ethereumDAO.transfer(wallet.address(), amountToTransfer)
    })

    // 1 create
    const txHash = await store.dispatch(a.createWallet(walletModel))
    expect(txHash).not.toBeNull()
  })

  it('should send ETH with multisig transfer', async (done) => {
    const amountToTransfer = new BigNumber(2.2)
    const amountToMSTransfer = new BigNumber(1)

    const dao = await contractsManagerDAO.getWalletsManagerDAO()
    await dao.watchWalletCreate(async (wallet: MultisigWalletModel) => {
      multisigWalletService.on('Deposit', async (walletId, tokenId, amount) => {
        expect(tokenId).toEqual('ETH')
        expect(amount).toEqual(amountToTransfer)

        // 3 send back
        const token = wallet.tokens().get(tokenId)
        await store.dispatch(a.multisigTransfer(wallet, token, amountToMSTransfer, accounts[0]))
      })

      multisigWalletService.on('ConfirmationNeeded', async (walletId, pendingTxModel) => {
        expect(pendingTxModel.id()).not.toBeNull()
        // 4 confirm from second account
        AbstractContractDAO.setAccount(accounts[1])
        await store.dispatch(a.confirmMultisigTx(wallet, pendingTxModel))
        // revert to first
        AbstractContractDAO.setAccount(accounts[0])
      })

      multisigWalletService.on('Confirmation', async (walletId, multisigTransactionModel: MultisigTransactionModel) => {
        // 5 sended
        expect(multisigTransactionModel.value()).toEqual(amountToMSTransfer)
        expect(multisigTransactionModel.symbol()).toEqual('ETH')
        expect(multisigTransactionModel.wallet()).toEqual(wallet.address())

        // 6 clean up
        // await multisigWalletService.unsubscribeAll()
        done()
      })
      await store.dispatch(a.watchMultisigWallet(wallet))
      // 2 transfer to ms-wallet
      await ethereumDAO.transfer(wallet.address(), amountToTransfer)
    })

    // 1 create wallet
    await store.dispatch(a.createWallet(walletModel))
  })
})
