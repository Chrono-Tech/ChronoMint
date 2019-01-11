/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/*global TimeoutLength*/
import { openBrowser, openPage } from './utils'
import { checkNotAuthorized, signInByMnemonicKey, signOut } from './utils/signInOutUp'

describe('Sign Out', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await openBrowser()
    page = await openPage(browser)
  })

  it('signs out successfully', async () => {
    await signInByMnemonicKey(page, 'sign-in-out', 'sign-in-out',
      'until track swap effort secret regret found forum monitor gown boy domain')
    await signOut(page)
    await checkNotAuthorized(page)
  }, TimeoutLength)

  afterAll(() => {
    browser.close()
  })
})
