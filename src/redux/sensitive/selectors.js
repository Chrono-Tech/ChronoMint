export const hasStoredWallet = state => !!state.get('sensitive').wallets.count()
