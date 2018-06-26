import {
  AccountEntryModel,
} from 'models/persistAccount'

export const replaceWallet = (wallet, walletList) => {
  let index = walletList.findIndex((item) => item.key === wallet.key)

  let copyWalletList = [...walletList]

  copyWalletList.splice(index, 1, wallet)

  return copyWalletList
}

export const removeWallet = (walletsList, name) => {
  return walletsList.filter((w) => w.name !== name)
}

export const getAccountAddress = (account: AccountEntryModel, hexFormat = false) => {
  return account.encrypted && account.encrypted[0] && `${ hexFormat ? '0x' : ''}${account.encrypted[0].address}` || ''
}

export const getWalletsListAddresses = (walletsList = []) => {
  return walletsList.map((wallet) => getAccountAddress(wallet, true))
}
