// @flow
  
import { AccountModel, AccountEntryModel } from '../../models'
import Accounts from 'web3-eth-accounts'
import { createTransform } from 'redux-persist'

export const decryptedAccountTransform = () => createTransform(
  (state: AccountModel) => {
    if (state) {
      return new AccountEntryModel({
        key: state.entry.key,
        name: state.entry.name,
        encrypted: state.wallet.encrypt(state.entry.key),
      })
    } else {
      return null
    }
  },
  (state: AccountEntryModel) => {
    if (state) {
      const accountEntryModel = new AccountEntryModel(state)
      console.log('we are here')
      console.log(accountEntryModel)
      const accounts = new Accounts()
      return new AccountModel({
        entry: accountEntryModel,
        wallet: accounts.wallet.decrypt(accountEntryModel.encrypted, accountEntryModel.key),
      })
    } else {
      return null
    }
  },
  { whitelist: ['decryptedWallet'] }
)

