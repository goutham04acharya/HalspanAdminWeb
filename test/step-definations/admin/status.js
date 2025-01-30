const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I change the status of the version to testing', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // const status = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]/`)));
    await driver.wait(until.elementLocated(By.css('[data-testid="status-0"]'))).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="Testing"]'))).click();
});

When('I change the status of the version to publish', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]/*[@data-testid='status']`))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid="status-0"]'))).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="Published"]'))).click();
});