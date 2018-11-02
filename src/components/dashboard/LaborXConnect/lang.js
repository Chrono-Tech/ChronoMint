/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const prefix = 'LaborXConnect'

export default {
  en: {
    titleStepOne: 'Mining Deposit Amount',
    titleStepTwo: 'Download Node',
    messageStepOne: 'The amount will be distributed form your TIME Deposit. Transaction fee in amount of ETH 0.02 will be withdrawn from your wallet.',
    messageStepTwo: 'Install and launch desktop application and click "Start Mining".',

    transactionFee: 'Transaction fee',
    proceed: 'proceed',
    confirm: 'confirm',
    amount: 'Amount TIME',
    laborXConnectFirst: {
      note: 'Enter LaborX deposit amount',
      noteText:
        'The specified amount will be locked on the ' +
        'Mainnet and will not be available for withdraw until you ' +
        'decide to unlock it. This transaction has a fixed fee and includes ' +
        'request fee and Labor-Hour token purchase to activate your deposit ' +
        'on LaborX network.',
    },
    laborXConnectSecond: {
      note: 'Activate LaborX deposit',
      noteText: 'Your transfer has been completed. ' + 'Please confirm the operation to activate your funds on LaborX network.',
    },
    nodes: {
      winNode: 'Windows node',
      macNode: 'MacOS node',
      linuxNode: 'Linux node',
    },
    settingsForm: {
      title: 'Mining Deposit Settings',
      message: 'The amount will be distributed form your TIME Deposit. Transaction fee in amount of ETH 0.02 will be withdrawn from your wallet.',
      customNode: 'Use custom node (Min deposit: %{amount})',
      reward: 'Reward: %{symbol} %{amount} / block',
      download: 'Download',
    },
    accept: 'Accept',
    max: 'max',
  },
}
