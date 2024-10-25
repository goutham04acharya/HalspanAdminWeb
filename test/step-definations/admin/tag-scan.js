const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click the tag scan button', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    await driver.wait(until.elementLocated(By.css(`[data-testid="tag-scan"]`))).click();
});

When('I click the type for tag as {string}', async function (type) {
    await new Promise(resolve => setTimeout(resolve, 950));
    await driver.wait(until.elementLocated(By.css(`[data-testid="${type}"]`))).click();
});

When('I click the source for tag as {string}', async function (source) {
    await new Promise(resolve => setTimeout(resolve, 950));
    await driver.wait(until.elementLocated(By.css(`[data-testid="${source}"]`))).click();
});
