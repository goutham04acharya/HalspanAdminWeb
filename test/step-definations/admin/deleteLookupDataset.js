const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber');
// const { driver } = require('localforage');
const { By, until, Key } = require('selenium-webdriver')

When('I click the delete option for a lookup dataset', async function () {
    await new Promise(resolve => setTimeout(resolve, 1500));
    tbody = await driver.wait(until.elementLocated(By.css(`tbody`)));
    await driver.wait(until.elementIsVisible(tbody))

    const id = await driver.wait(until.elementLocated(By.css(`tbody tr:nth-child(4) td:nth-child(1)`))).getText();
    console.log(id, 'pppooo')
    this.id = id
    await driver.wait(until.elementLocated(By.css(`[data-testid="delete-${this.id}"]`))).click();
});

Then('I should see a confirmation prompt for deletion', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Delete Lookup Dataset"]')));
});

Then('I should read success message for delete user', { timeout: 35000 }, async function () {
    let check = false;
    let retries = 400;

    console.log(`Deleted ID ${this.id} successfully`)
    while (retries > 0) {
        const pageSource = await driver.getPageSource();
        console.log(this.id, 'the id');
        check = pageSource.includes(`Deleted ID ${this.id} successfully`);
        console.log(check);
        if (check) {
            return 'passed';
        } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries--;
        }
    }
    throw new Error('Failed');
});