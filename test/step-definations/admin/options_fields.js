const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber');
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I toggle the options {string}',async function (options) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementsLocated(By.css(`[data-testid = "${options}"]`)));
    await driver.wait(until.elementsLocated(By.css(`[data-testid = "${options}"]`)));
});