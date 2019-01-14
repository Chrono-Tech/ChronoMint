/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/*global TimeoutLength*/
/* eslint-disable */

import faker from 'faker'

import { clickText, getText, openBrowser, openPage } from './utils'
import { checkAuthorized, submitSignInForm, submitSignUpForm } from './utils/signInOutUp'

describe('Sign Up', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await openBrowser()
    page = await openPage(browser)
  })

  it('passes the sign-up process successfully', async () => {
    await page.goto('https://localhost:3000', { timeout: TimeoutLength })
    await clickText(page, 'Add an existing account')
    await clickText(page, 'Create New Account')

    const username = faker.internet.userName()
    const password = faker.internet.password()
    await submitSignUpForm(page, username, password)

    const mnemonicKey = await getText(page, '[class^=GenerateMnemonic__passPhrase_]')
    await clickText(page, 'Proceed')
    const clickDelay = 750

    mnemonicKey.split(' ').map((word, index) => {
      setTimeout(async () => await clickText(page, word), index * clickDelay)
    })

    await page.waitFor(clickDelay * mnemonicKey.split(' ').length)
    await clickText(page, 'Done')
    await clickText(page, 'Finish')

    await submitSignInForm(page, username, password)
    await checkAuthorized(page)
  }, TimeoutLength)

  afterAll(() => {
    browser.close()
  })
})
