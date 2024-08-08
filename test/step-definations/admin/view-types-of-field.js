const assert = require('assert');
const { Then } = require('@cucumber/cucumber');
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Then('I should see the add field', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Add Field"]')));
});

Then('I should see types of field {string}', async function (fieldTypesString) {
    console.log('djhdhfjhfjsdh');
    const expectedFieldTypes = JSON.parse(fieldTypesString);
    for (const fieldType of expectedFieldTypes) {
        const testId = `${fieldType.replace(/ /g, '-').toLowerCase()}`;
        await driver.wait(until.elementLocated(By.css(`[data-testid="${testId}"]`)));
    }
});
