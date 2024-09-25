const { When } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By

When('I click the save button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-section"]`))).click(); 
    await new Promise(resolve => setTimeout(resolve, 500));  
    await driver.wait(until.elementLocated(By.css(`[data-testid="save"]`))).click();
});