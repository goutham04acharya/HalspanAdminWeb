const {When } = require('@cucumber/cucumber');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By

When('I toggle the options {string}',async function (option) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementsLocated(By.css(`[data-testid = "${option}"]`)));
    await driver.wait(until.elementsLocated(By.css(`[data-testid = "${option}"]`)));
});