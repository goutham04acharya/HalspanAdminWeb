/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const path = require('path');
const Key = webdriver.Key

When('I select the time in the field', async function () {
    await new Promise(resolve => setTimeout(resolve, 200));
    await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-0-page-0-question-0"] [data-testid="time-field"]`))).click();
    await new Promise(resolve => setTimeout(resolve, 200));
    await driver.wait(until.elementLocated(By.css('[data-testid="preview-section-0-page-0-question-0"] [data-testid="h-03"]'))).click();
    await new Promise(resolve => setTimeout(resolve, 200));
    await driver.wait(until.elementLocated(By.css('[data-testid="preview-section-0-page-0-question-0"] [data-testid="m-03"]'))).click();
    await new Promise(resolve => setTimeout(resolve, 200));
    await driver.wait(until.elementLocated(By.css('[data-testid="preview-section-0-page-0-question-0"] [data-testid="s-03"]'))).click();
    await new Promise(resolve => setTimeout(resolve, 200));
    await driver.wait(until.elementLocated(By.css('[data-testid="preview-section-0-page-0-question-0"] [data-testid="PM"]'))).click();
} );

Then('I should see the time added to the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const timeField = await driver.wait(until.elementLocated(By.css(
        `[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${questionNumber - 1}"] [data-testid="time-field"]`
    )));
    const time = await timeField.getAttribute('value');
    console.log(time);
    assert.strictEqual(time, '03:03:03 PM');
});
