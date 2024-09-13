const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click the duplicate button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="duplicate"]`))).click();
});

Then('I should see a confirmation modal to select the version', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Select Version"]')));
});

When('I select the version of the questionnaire', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="select-version"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="version-1"]`))).click();
});

When('I click the confirm duplicate button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="confirm-duplicate"]`))).click();
});

Then('I should see the new version created', async function () {
    const rows = await driver.findElements(By.xpath(`//tbody/tr`));
    const n = rows.length;
    let versionsAfter = [];

    for (let i = 1; i <= n; i++) {
        if (i % 2 === 1) {
            const versionNumber = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[${i}]/td[1]`))).getText();
            versionsAfter.push(versionNumber);
        }
    }

    versionsAfter.sort();
    const newVersions = versionsAfter.filter(version => !global.versionsBefore.includes(version));
    if (newVersions.length === 1) {
        console.log('New version added:', newVersions[0]);
    } else {
        throw new Error('No new version was added or multiple new versions were found.');
    }
    console.log('Versions after duplication:', versionsAfter);
});
