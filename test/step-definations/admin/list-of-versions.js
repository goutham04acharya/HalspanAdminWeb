const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click on the internal name of a questionnaire from the list', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const element = await driver.wait(until.elementLocated(By.css('tbody tr:nth-child(4) td:nth-child(2) u')));
    this.internalName = await element.getText();
    console.log('this internal name', this.internalName)
    await element.click();
});

Then('I should be redirected to the questionnaire version listing screen', async function () {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await driver.wait(until.elementLocated(By.xpath(`//p[text()="${this.internalName}"]`)));
});

Given('I should see the versions of the questionnaire', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I click on back to all questionnaire', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="back-to-questionnaire"]'))).click();
});

Then('I should see the version table header containing {string}', async function (tableHeader) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const arr = JSON.parse(tableHeader);
    const tableData = await driver.wait(until.elementLocated(By.xpath('//table/thead'))).getText();
    arr.forEach(element => {
        return assert(tableData.includes(element));
    });
});