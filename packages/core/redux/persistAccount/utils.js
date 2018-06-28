export const replaceWallet = (wallet, walletList) => {
  let index = walletList.findIndex((item) => item.key === wallet.key)

  let copyWalletList = [...walletList]

  copyWalletList.splice(index, 1, wallet)

  return copyWalletList
}

export const removeWallet = (walletsList, name) => {
  return walletsList.filter((w) => w.name !== name)
}
