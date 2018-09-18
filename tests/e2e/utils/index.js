/*global windowSize*/
import puppeteer from 'puppeteer';

export async function clickByXpahSelector (page, selector) {
  await (await page.$x(selector))[0].click();
}

export async function clickText (page, text) {
  await clickByXpahSelector(page, `//*[text()="${text}"]`);
}

export async function getText (page, selector) {
  return await page.evaluate((selector) => document.querySelector(selector).textContent, selector);
}

export async function openBrowser () {
  return await puppeteer.launch({
    headless: false,
    args: [`--window-size=${windowSize.width},${windowSize.height}`],
    ignoreHTTPSErrors: true
  });
}

export async function openPage (browser) {
  const page = await browser.newPage();
  await page.setViewport(windowSize);
  return page;
}

export async function typeFieldValue (page, selector, value) {
  await page.focus(selector);
  await page.keyboard.type(value);
}
