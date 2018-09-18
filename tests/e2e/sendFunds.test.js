/*global TimeoutLength*/

import { openBrowser, openPage } from './utils';
import sendFunds from './utils/sendFunds';

describe('Send Funds', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await openBrowser();
    page = await openPage(browser);
  });

  it('sends BTC', async () => {
    await sendFunds(page, 'mpMD85MdtkaBLYNkSMXZcpn3PEW15NNteG', 'mszetFaax2z9XfWNc3XgEVSSuqDRV51ALh',
      'BTC', 0.02, 0.001);
  }, TimeoutLength);

  it('sends ETH', async () => {
    await sendFunds(page, '0x44396dded98751d285321dc61836226caffe0dbd', '0xa7ec4a28f7c39650d7cce33ef9847bccee02e993',
      'ETH', 0.02, 0.0001);
  }, TimeoutLength);

  afterAll(() => {
    browser.close();
  });
});
