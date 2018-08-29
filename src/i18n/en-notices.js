/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  ASSET_PAUSED,
  ASSET_UNPAUSED,
  MANAGER_ADDED,
  MANAGER_REMOVED,
  USER_ADDED_TO_BLACKLIST,
  USER_DELETED_FROM_BLACKLIST,
} from '@chronobank/core/models/notices/AssetsManagerNoticeModel'

export default {
  approval: {
    title: 'Approval',
    message: '%{amount} %{symbol} approved to transfer for %{contractName} contract',
    details: {
      contractName: 'Contract Name',
      amount: 'Value',
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
    receivedFrom: '%{amount} %{symbol} received from %{address}',
    sentTo: '%{amount} %{symbol} sent to %{address}',
    errors: {
      TRANSFER_CANCELLED: 'Cancelled by user from tx confirmation modal',
      TRANSFER_UNKNOWN: 'Unknown transaction error',
    },
  },
  profile: {
    copyIcon: 'Your address has been copied to the clipboard.',
    pkIcon: 'Your private key has been copied to the clipboard.',
    changed: 'Profile has been successfully changed.',
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
  assetsManager: {
    title: 'Assets manager',
    [MANAGER_ADDED]: 'Manager added',
    [MANAGER_REMOVED]: 'Manager removed',
    [ASSET_PAUSED]: 'Asset %{symbol} was blocked',
    [ASSET_UNPAUSED]: 'Asset %{symbol} was unblocked',
    [USER_ADDED_TO_BLACKLIST]: 'User (%{address}) was added to blacklist',
    [USER_DELETED_FROM_BLACKLIST]: 'User (%{address}) was deleted from blacklist',
  },
}
