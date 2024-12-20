/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click the date\\/time for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const date_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(date_area), 2000);
    await date_area.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);
    await date_area.sendKeys('31/10/2024');
    // await date_area.click();
    // await driver.wait(until.elementLocated(By.xpath('//*[text()="December"]'))).click();
    // await driver.wait(until.elementLocated(By.xpath('//*[text()="Oct"]'))).click();
    // await driver.wait(until.elementLocated(By.xpath('//*[text()="30"]'))).click();

    // driver.executeScript((sectionNum, pageNum, quesionNum) => {
    //     let input = document.querySelector(`[data-testid="preview-section-${sectionNum - 1}-page-${pageNum - 1}-question-${quesionNum - 1}"] [data-testid="input"]`)
    //     input.value = '2024-10-31';
    //     const inputEvent = new Event('input', { bubbles: true });
    //     input.dispatchEvent(inputEvent);

    //     // Create and dispatch the 'change' event
    //     const changeEvent = new Event('change', { bubbles: true });
    //     input.dispatchEvent(changeEvent);

    //     return
    // }, sectionNumber, pageNumber, quesionNumber)

    
});