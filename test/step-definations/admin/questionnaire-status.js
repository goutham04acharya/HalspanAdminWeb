const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key;

Then('I should be redirected to questionnaire version listing screen', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath("//p[contains(text(), 'Choose a Version')]")), 10000);
});

When('I search by public name in questionnaire listing', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    await searchBox.sendKeys(global.publicNameStatus);
    await new Promise(resolve => setTimeout(resolve, 3000));
});

Then('I should see the status as {string}', async function (string) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let statusElement = await driver.wait(until.elementLocated(By.css('[data-testid="status"]')), 10000);
    this.status = await statusElement.getText();
    console.log(this.status, "1234");
    assert.equal(this.status, string);
});

When('I click on the questionnaire', async function () {
    let quesionnaire = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`)), 10000);
    await quesionnaire.click();
});

Given('I am on the Questionnaire management sections for versions', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    console.log(global.internalName);
    await driver.wait(until.elementLocated(By.xpath(`//*[text()="${global.internalName}"]`)));
});

When('I click the publish button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="publish"]')), 10000).click();
    await new Promise(resolve => setTimeout(resolve, 2000));
});

When('I click the cancel button for questionnaire', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="cancel-qsn"]')), 10000).click();
})