const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click the add conditional logic button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-conditional-logic"]`))).click();
});

Then('I should see the advanced editor for textfield', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Advanced Editor"]')));
});

When('I enter the incorrect conditional logic', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I enter the correct conditional logic', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});