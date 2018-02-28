export default {
  approval: {
    title: 'Approval',
    message: '%{value} %{symbol} approved to transfer for %{contractName} contract',
    details: {
      contractName: 'Contract Name',
      value: 'Value',
    },
  },
  arbitrary: {
    title: 'Notice',
  },
  error: {
    title: 'Error',
  },
  cbe: {
    added: 'CBE %{address} was added',
    removed: 'CBE %{address} was removed',
  },
  locs: {
    title: 'LOC',
    added: '\'%{name}\' was added.',
    removed: '\'%{name}\' was removed.',
    updated: '\'%{name}\' was updated.',
    statusUpdated: '\'%{name}\' status was updated.',
    issued: '\'%{name}\' issued tokens.',
    revoked: '\'%{name}\' redeemed tokens.',
    failed: '\'%{name}\' is failed.',
    details: {
      amount: 'Amount',
    },
  },
  polls: {
    title: 'Polls',
    isCreated: 'Poll created',
    isActivated: 'Poll activated',
    isEnded: 'Poll ended',
    isUpdated: 'Poll updated',
    isRemoved: 'Poll removed',
    isVoted: 'Poll voted',
  },
  transfer: {
    title: 'Transfer',
    receivedFrom: '%{value} %{symbol} received from %{address}',
    sentTo: '%{value} %{symbol} sent to %{address}',
    errors: {
      TRANSFER_CANCELLED: 'Cancelled by user from tx confirmation modal',
      TRANSFER_UNKNOWN: 'Unknown transaction error',
    },
  },
  profile: {
    copyIcon: 'Your address has been copied to the clipboard.',
    pkIcon: 'Your private key has been copied to the clipboard.',
  },
  operations: {
    title: 'Pending Operations',
    confirmed: 'Operation confirmed, signatures remained: %{remained}',
    cancelled: 'Operation cancelled',
    revoked: 'Operation revoked, signatures remained: %{remained}',
    done: 'Operation complete',
    details: {
      hash: 'Hash',
      operation: 'Operation',
    },
  },
  settings: {
    title: 'Settings',
    erc20: {
      tokens: {
        isAdded: 'Token "%{symbol} – %{name}" was added.',
        isModified: 'Token "%{symbol} – %{name}" was modified.',
        isRemoved: 'Token "%{symbol} – %{name}" was removed.',
      },
    },
  },
  downloads: {
    started: '%{name}: Download started',
    failed: '%{name}: Download failed, check your network connection',
    completed: '%{name}: Download completed',
  },
  wallet: {
    title: 'Wallet',
    create: '%{name}: Created',
  },
}
