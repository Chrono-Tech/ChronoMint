import { clickText, typeFieldValue } from '.'
import { openMyAccountsPage, signInByMnemonicKey, submitSignInForm, signOut } from './signInOutUp'

async function getCurrencyMainJsHandle (page, address) {
  const selector = `//span[contains(@class,"WalletWidget__address-address_")][text()="${address}"]`
  await page.waitForXPath(selector)
  return await page.evaluateHandle(element => element.parentNode.parentNode.parentNode, (await page.$x(selector))[0])
}

async function getBalance (page, address, currencyName) {
  const currencyMainJsHandle = await getCurrencyMainJsHandle(page, address)
  const balance = await page.evaluate(node => node.querySelector('[class^=WalletWidget__crypto-amount_]').textContent,
    currencyMainJsHandle)
  return parseFloat(balance.replace(currencyName, '').trim())
}

async function sendFunds (page, senderAddress, recipientAddress, amount) {
  const currencyMainJsHandle = await getCurrencyMainJsHandle (page, senderAddress)
  await (await currencyMainJsHandle.asElement().$('button')).click()
  await page.waitForSelector('[name=recipient]')
  await typeFieldValue(page, '[name=recipient]', recipientAddress)
  await typeFieldValue(page, '[name=amount]', amount.toString())
  await clickText(page, 'Send')
  await page.waitForXPath('//*[text()="Confirm"]')
  await clickText(page, 'Confirm')
}

function checkBalanceChange (actualChange, amount, estimatedTransferFee) {
  expect(actualChange >= amount - estimatedTransferFee).toBe(true)
  expect(actualChange <= amount).toBe(true)
}

export default async function send (page, senderAddress, recipientAddress, currencyName, amount, estimatedTransferFee) {
  const sender = {
    address: senderAddress,
    username: 'sender',
    password: 'sender',
    mnemonicKey: 'consider injury federal west guitar nut blast maple quick unhappy multiply night',
  }

  await signInByMnemonicKey(page, sender.username, sender.password, sender.mnemonicKey)
  sender.initialBalance = await getBalance(page, sender.address, currencyName)
  await signOut(page)

  const recipient = {
    address: recipientAddress,
    username: 'recipient',
    password: 'recipient',
    mnemonicKey: 'prize transfer park kitten glass hungry sibling abstract saddle lend wait layer',
  }

  await signInByMnemonicKey(page, recipient.username, recipient.password, recipient.mnemonicKey)
  recipient.initialBalance = await getBalance(page, recipient.address, currencyName)
  await signOut(page)

  await openMyAccountsPage(page)
  await submitSignInForm(page, sender.username, sender.password)

  await sendFunds(page, sender.address, recipient.address, amount)
  sender.currentBalance = await getBalance(page, sender.address, currencyName)
  await signOut(page)

  await page.waitFor(16000)
  await openMyAccountsPage(page)
  await submitSignInForm(page, recipient.username, recipient.password)

  recipient.currentBalance = await getBalance(page, recipient.address, currencyName)
  checkBalanceChange(recipient.currentBalance - recipient.initialBalance, amount, estimatedTransferFee)
  await sendFunds(page, recipient.address, sender.address, amount - estimatedTransferFee)
}
