const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I check the field validation', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementsLocated(By.css(`[data-testid = "Field validation"]`)));
});

When('I enter the custom regular expression as {string}', async function (regex) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementsLocated(By.css(`[data-testid = "regex-input"]`))).sendkeys(regex);
});

When('I enter the format error message as {string}', async function (message) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementsLocated(By.css(`[data-testid = "format-error-input"]`))).sendkeys(message);
});