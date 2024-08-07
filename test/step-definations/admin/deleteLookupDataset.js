const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber');
// const { driver } = require('localforage');
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click the delete option for a lookup dataset', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    const id = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[1]`)), 1000).getText();
    console.log(id, 'pppooo')
    this.id = id
    await driver.wait(until.elementLocated(By.css('[data-testid="delete"]'))).click();
});

Then('I should see a confirmation prompt for deletion', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Delete Lookup Dataset"]')));
});

Then('I should read success message for delete user', { timeout: 35000 }, async function () {
    let check = false;
    let retries = 400;

    while (retries > 0) {
        const pageSource = await driver.getPageSource();
        console.log(this.id, 'the id');
        check = pageSource.includes(`Deleted ID ${this.id} successfully`);

        if (check) {
            return 'passed';
        } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries--;
        }
    }
    throw new Error('Failed');
});