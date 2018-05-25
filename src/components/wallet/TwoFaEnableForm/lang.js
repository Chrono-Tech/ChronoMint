/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const prefix = 'TwoFaEnableForm'

export default {
  en: {
    pageTitle: 'Enable 2FA',
    title: 'Download App to enable two-factor authentication',
    description_1: `2FA provides an additional security level for your wallet by generating one-time code in your mobile App for the wallet login and transaction operations.`,
    description_2: `Enable 2FA if you do not plan to have more than 1 owner for the wallet.`,
    description_3: `Install Google Authenticator using the links below. Click Proceed on the form after the app installation.`,
    proceed: 'proceed',
    firstStepTitle: 'Write down your backup code',
    firstStepDescription: 'You will need this code to restore App in case of emergencies. We recommend you to store the code on paper and keep it in safe place.',
    secondStepTitle: 'Complete App Setup',
    secondStepDescription: 'Launch Google Authentication App, tap Begin Setup and scan QR code provided below.',
    thirdStepTitle: 'Enter Code',
    thirdStepDescription: 'Enter a code you see in your App.',
    authCode: 'Authentication code',
    confirm: 'I’ve stored the backup code',
    done: 'done',
  },
}
