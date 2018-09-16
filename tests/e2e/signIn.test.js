/*global TimeoutLength*/
import { openBrowser, openPage } from './utils';
import { checkAuthorized, signInByMnemonicKey } from './utils/signInOutUp';

describe('Sign In', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await openBrowser();
    page = await openPage(browser);
  });

  it('passes the sign-in process with mnemonic key successfully', async () => {
    await signInByMnemonicKey(page, 'sign-in-out', 'sign-in-out',
      'until track swap effort secret regret found forum monitor gown boy domain');
    await checkAuthorized(page);
  }, TimeoutLength);

  afterAll(() => {
    browser.close();
  });
});
