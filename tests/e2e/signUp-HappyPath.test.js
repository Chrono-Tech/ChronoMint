import { Builder } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import { By } from 'selenium-webdriver/lib/by'
import faker from 'faker';

describe('Sign Up (Happy Path)', () => {
  let driver;

  beforeAll(async () => {
    const chromeOptions = new Options();
    chromeOptions.setUserPreferences({ 'download.default_directory': __dirname });
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .usingServer('http://localhost:4444/wd/hub')
      .build();
  });

  it('passes the sign-up process successfully', async () => {
    await driver.get('https://localhost:3000');
    await driver.findElement(By.xpath('//*[text()="Add an existing account"]')).click();
    await driver.findElement(By.xpath('//*[text()="Create New Account"]')).click();

    const username = faker.internet.userName();
    const password = faker.internet.password();

    await driver.findElement(By.name('walletName')).sendKeys(username);
    await driver.findElement(By.name('password')).sendKeys(password);
    await driver.findElement(By.name('confirmPassword')).sendKeys(password);
    await driver.findElement(By.xpath('//*[text()="Create new account"]')).click();

    const mnemonicKey = await driver.findElement(By.xpath('//*[contains(@class, "GenerateMnemonic__passPhrase_")]'))
      .getText();
    await driver.findElement(By.xpath('//*[text()="Proceed"]')).click();
    const clickDelay = 750;

    mnemonicKey.split(' ').map((word, index) => {
      setTimeout(() => driver.findElement(By.xpath(`//*[text()="${word}"]`)).click(), index * clickDelay);
    });

    await driver.sleep(clickDelay * mnemonicKey.split(' ').length);
    await driver.findElement(By.xpath('//*[text()="Done"]')).click();
    await driver.findElement(By.xpath('//*[text()="Finish"]')).click();

    await driver.sleep(7000);
    driver.findElement(By.className('chronobank-icon')).click();
    await driver.sleep(2000);
    await driver.findElement(By.name('password')).sendKeys(password);
    await driver.findElement(By.xpath('//*[contains(@class, "Button__login_")]')).click();

    await driver.sleep(15000);
    const list = await driver.findElements(By.xpath('//*[contains(text(),"Add a wallet")]'));
    expect(list.length > 0).toBe(true);
  }, 180000);

  afterAll(async function () {
    await driver.quit();
  })
});
