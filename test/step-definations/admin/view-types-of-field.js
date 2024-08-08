const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber');
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Then('I should see the add field', async function () {
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Add Field"]')));
});

Then('I should see types of field {string}', async function (fieldTypesString) {
    const expectedFieldTypes = JSON.parse(fieldTypesString);
    for (const fieldType of expectedFieldTypes) {
        const dataTestId = `${fieldType.replace(/ /g, '-').toLowerCase()}`;
        await driver.wait(until.elementLocated(By.css(`[data-testid="${dataTestId}"]`)));
    }
});
