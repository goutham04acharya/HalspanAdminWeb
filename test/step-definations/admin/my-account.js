const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const path = require('path');
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I click the my account button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="my-account"]`))).click();
});


Then('I should be redirected to my account', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // Wait for the redirection to complete and verify the URL
    const currentUrl = await driver.getCurrentUrl();
    const expectedUrl = 'https://dev.uvik.halspantest.com/en/home';
    
    if (currentUrl !== expectedUrl) {
        throw new Error(`Expected URL to be ${expectedUrl}, but got ${currentUrl}`);
    }
});
