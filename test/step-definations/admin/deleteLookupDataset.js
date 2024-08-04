const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber');
const { driver } = require('localforage');
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click the delete option for a lookup dataset', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    let actionCell = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[3]`)), 1000);
    await actionCell.findElement(By.css('[data-testid="action"]')).click();
    await driver.wait(until.elementLocated(By.css('[data-testid="delete"]'))).click();
});

Then('I should see a confirmation prompt for deletion', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Delete Lookup Dataset"]')));
});