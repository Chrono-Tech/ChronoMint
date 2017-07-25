export default {
  approval: {
    title: 'Approval',
    message: '%{value} %{symbol} approved to transfer for %{contractName} contract',
    details: {
      contractName: 'Contract Name',
      value: 'Value'
    }
  },
  arbitrary: {
    title: 'Notice'
  },
  cbe: {
    added: 'CBE %{address} was added',
    removed: 'CBE %{address} was removed'
  },
  locs: {
    added: 'LOC \'%{name}\' added',
    removed: 'LOC \'%{name}\' removed',
    updated: 'LOC \'%{name}\' updated',
    statusUpdated: 'LOC \'%{name}\' status updated',
    issued: 'LOC \'%{name}\' issued',
    revoked: 'LOC \'%{name}\' revoked',
    failed: 'LOC \'%{name}\' failed',
    details: {
      amount: 'Amount'
    }
  },
  transfer: {
    title: 'Transfer',
    receivedFrom: '%{value} %{symbol} received from %{address}',
    sentTo: '%{value} %{symbol} sent to %{address}'
  },
  profile: {
    copyIcon: 'Your address has been copied to the clipboard.'
  },
  tx: {
    processing: 'Transaction is processing...'
  },
  operations: {
    confirmed: 'Operation confirmed, signatures remained: %{remained}',
    cancelled: 'Operation cancelled',
    revoked: 'Operation revoked, signatures remained: %{remained}',
    done: 'Operation complete',
    details: {
      hash: 'Hash',
      operation: 'Operation'
    }
  },
  settings: {
    erc20: {
      tokens: {
        isAdded: 'Token "%{symbol} – %{name}" was added.',
        isModified: 'Token "%{symbol} – %{name}" was modified.',
        isRemoved: 'Token "%{symbol} – %{name}" was removed.'
      }
    }
  }
}
