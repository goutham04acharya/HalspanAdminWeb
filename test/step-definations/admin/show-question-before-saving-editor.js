/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const path = require('path');
const By = require('selenium-webdriver').By
const Key = webdriver.Key;

Then('I should see the questions in editor', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="select-0-0"]`))).click();
    const question = await driver.wait(until.elementLocated(By.css(`[data-testid="select-dropdown-0-0-0"]`))).getText();    
    assert.equal(question, 'Section_1.Page_1.Sample_Label_Name');
});
