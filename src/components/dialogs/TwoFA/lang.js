/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const prefix = 'TwoFA'

export default {
  en: {
    formTitle: 'Two–factor authentication',
    // intro
    introTitle: 'Protect your Wallet by enabling two-factor authentication',
    introContent1: 'Protect your Wallet from unauthorized access by enabling two-factor authentication ' +
      'When two-factor authentication is active you need to enter a one time code every time you login.',
    introContent2: 'We offer mobile based type of two-factor authentication.',
    // step1
    step1Description: 'Install the authentication app on your phone. <strong>Google Authenticator</strong> is available on Android, iOS. ' +
      'You can find it from <span>%{googleIcon}</span> <strong>Google Play</strong> or <span>%{appStoreIcon}</span> <strong>App Store</strong>.',
    threeStepsTo: '3 steps to',
    enable: 'Enable',
    mobileApp: 'Mobile App',
    based2fa: 'based two-factor authentication',
    iHaveWrittenCode: 'I have written down the backup code on paper',
    // step2
    step2Description: 'Write down the backup code shown on the page and keep it in a safe place, preferably on paper. It\'s very important that you do this.',
    yourBackupCode: 'Your backup code:',
    // step3
    step3Description: 'Launch the <strong>Google Authenticator</strong> app on your smartphone, press Begin Setup. Select Scan Barcode from the mobile app. <strong>Scan the barcode</strong> shown on this page.',
    step3details: '<strong>To complete the setup</strong>, enter the Authentication code from the Google Authenticator',
    authCode: 'Authentication code',
    //  actions
    enable2FA: 'Enable two-factor authentication',
    proceedToActivation: 'Proceed to activation',
  },
}
