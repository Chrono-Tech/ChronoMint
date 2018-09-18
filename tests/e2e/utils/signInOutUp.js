/*global TimeoutLength*/
import { clickByXpahSelector, clickText, typeFieldValue } from './';

export const submitSignInForm = async function (page, username, password) {
  await page.waitForXPath(`//*[text()="${username}"]`);
  await clickText(page, username);
  await page.waitForSelector('[name=password]');
  await typeFieldValue(page, '[name=password]', password);
  await clickByXpahSelector(page, '//*[contains(@class, "Button__login_")]');
  await page.waitForXPath('//*[text()="Add a wallet"]');
};

export async function checkAuthorized (page) {
  await expect(page).toMatch('Add a wallet');
}

export async function checkNotAuthorized (page) {
  await expect(page).not.toMatch('Add a wallet');
}

export async function openMyAccountsPage (page) {
  const myAccountsLinkSelector = 'a[title="My Accounts"]';
  await page.waitForSelector(myAccountsLinkSelector);
  await page.click(myAccountsLinkSelector);
}

export async function submitSignUpForm (page, username, password) {
  await page.waitForSelector('[name=walletName]');
  await typeFieldValue(page, '[name=walletName]', username);
  await typeFieldValue(page, '[name=password]', password);
  await typeFieldValue(page, '[name=confirmPassword]', password);
  await clickText(page, 'Create new account');
}

export async function signInByMnemonicKey (page, username, password, mnemonicKey) {
  await page.goto('https://localhost:3000/login/select-account', { timeout: TimeoutLength });
  await clickText(page, 'Add an existing account');
  await clickText(page, 'Mnemonic Key');

  await typeFieldValue(page, '[name=mnemonic]', mnemonicKey);
  await clickText(page, 'Submit');

  await submitSignUpForm(page, username, password);
  await page.waitForXPath('//*[text()="Finish"]');
  await clickText(page, 'Finish');
  await submitSignInForm(page, username, password);
}

export async function signOut (page) {
  await clickByXpahSelector(page, '//*[@title="Logout"]');
}
