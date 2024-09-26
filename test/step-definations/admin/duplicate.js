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
    await driver.wait(until.elementLocated(By.css(`[data-testid="Version"]`))).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="Version-1"]`))).click();
});

When('I click the confirm duplicate button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="confirm-duplicate"]`))).click();
});

// Then('I should see the new version created', async function () {
//     // Find all versions again by using the data-testid attribute
//     const versionDivs = await driver.findElements(By.css('[data-testid="version-"]'));
//     const n = versionDivs.length;
//     let versionsAfter = [];

//     // Loop through each version div and store its text
//     for (let i = 0; i < n; i++) {
//         const versionNumber = await versionDivs[i].getText();
//         versionsAfter.push(versionNumber);
//     }

//     versionsAfter.sort();

//     // Filter to find new versions
//     const newVersions = versionsAfter.filter(version => !global.versionsBefore.includes(version));
    
//     if (newVersions.length === 1) {
//         console.log('New version added:', newVersions[0]);
//     } else if (newVersions.length === 0) {
//         throw new Error('No new version was added.');
//     } else {
//         throw new Error('Multiple new versions were found.');
//     }

//     console.log('Versions after duplication:', versionsAfter);
// });

Then('I should see the new version created', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="version-0"]`)));
});