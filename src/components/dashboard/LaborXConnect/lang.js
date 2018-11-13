/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const prefix = 'LaborXConnect'

export default {
  en: {
    connectForm: {
      titleStepOne: 'Mining Deposit Amount',
      titleStepTwo: 'Download Node',
      messageStepOne: 'The amount will be distributed form your TIME Deposit.',
      messageStepTwo: 'Install and launch desktop application and click "Start Mining".',
      useOurNode: 'Use Our Node',
      useCustomNode: 'Use Custom Node',
      minDeposit : 'Min deposit: ',
      rewardPerBlock: 'Reward per block',
    },

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
      message: 'The amount will be distributed form your TIME Deposit.',
      customNode: 'Use custom node ',
      minDeposit: 'Min deposit: ',
      reward: 'Reward: ',
      block: 'block',
      download: 'Download',
    },
    accept: 'Accept',
    max: 'max',
  },
}
