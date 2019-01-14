/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/*global TimeoutLength*/
/* eslint-disable */

import { openBrowser, openPage } from './utils'
import sendFunds from './utils/sendFunds'

describe('Send Funds', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await openBrowser()
    page = await openPage(browser)
  })

  it('sends BTC', async () => {
    await sendFunds(page, 'mpMD85MdtkaBLYNkSMXZcpn3PEW15NNteG', 'mszetFaax2z9XfWNc3XgEVSSuqDRV51ALh',
      'BTC', 0.02, 0.001)
  }, TimeoutLength)

  it('sends DASH', async () => {
    await sendFunds(page, 'yV9hgDzzUz1b47RG9XBogTfrdryMhnw1i6', 'yYo9SQDwYGRZFEYtKDBvJ8LGATgn66vaLw',
      'DASH', 0.02, 0.001)
  }, TimeoutLength)

  it('sends ETH', async () => {
    await sendFunds(page, '0x44396dded98751d285321dc61836226caffe0dbd', '0xa7ec4a28f7c39650d7cce33ef9847bccee02e993',
      'ETH', 0.02, 0.0001)
  }, TimeoutLength)

  it('sends WAVES', async () => {
    await sendFunds(page, '3MuHNTMjfbUAJ57Xwjnhg1w7qZq8toGjCw1', '3MuNkBGG71eSBc4HBJYU2KH96m77Rh7WYhu',
      'WAVES', 0.2, 0.000001)
  }, TimeoutLength)

  it('sends XEM', async () => {
    await sendFunds(page, 'TCZRMYQBOLN62JIDT5QPSWDFEQRFLIFLZ6VIG6QO', 'TB5XY5YX6VKWHZMQ2ETNGT2PXQLNV4EHDSI2QQYU',
      'XEM', 0.2, 0.000001)
  }, TimeoutLength)

  afterAll(() => {
    browser.close()
  })
})
