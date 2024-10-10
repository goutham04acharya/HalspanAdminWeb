const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Then('I should see the advanced editor for number field', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="shows when..."]')));
});

When('I enter the correct conditional logic for number field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_Label_Name = 10');
});

When('I enter the incorrect conditional logic for number field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.includes("Roopesh")');
});