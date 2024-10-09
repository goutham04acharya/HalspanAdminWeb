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
    await driver.wait(until.elementLocated(By.xpath('//*[text()="shows when..."]')));
});

When('I enter the incorrect conditional logic', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.includes("Roopesh")');
});

When('I enter the correct conditional logic', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_Label_Name.includes("Roopesh")');
});

Then('I click the save button for conditional logic', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));  
    await driver.wait(until.elementLocated(By.css('[data-testid="save-conditional-logic"]'))).click();
    // await driver.wait(until.elementLocated(By.xpath('//button[text()="Save"]')), 10000).click();
});