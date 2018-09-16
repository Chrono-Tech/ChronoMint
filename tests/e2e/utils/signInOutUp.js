import { clickByXpahSelector, clickText, typeFieldValue } from './';

export const submitSignInForm = async function (page, username, password) {
  await clickText(page, username);
  await page.waitFor(2000);
  await typeFieldValue(page, '[name=password]', password);
  await clickByXpahSelector(page, '//*[contains(@class, "Button__login_")]');
  await page.waitFor(15000);
};

export async function checkAuthorized (page) {
  await expect(page).toMatch('Add a wallet');
}

export async function submitSignUpForm (page, username, password) {
  await typeFieldValue(page, '[name=walletName]', username);
  await typeFieldValue(page, '[name=password]', password);
  await typeFieldValue(page, '[name=confirmPassword]', password);
  await clickText(page, 'Create new account');
}

export default submitSignInForm;
