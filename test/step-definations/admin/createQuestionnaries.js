/* eslint-disable max-len */
const { Given, When, Then, But } = require('@cucumber/cucumber');
const { By, until, Key } = require('selenium-webdriver')
const { faker } = require('@faker-js/faker');

When('I click the create new questionnaire button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="createQuestionnaireBtn"]'))).click();
});

Then('I should see the questionnaire creation screen', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Create Questionnaire"]')));
});

When('I enter {string} in the public name field', async function (string) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "publicName"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE))
    await driver.wait(until.elementLocated(By.css('[data-testid = "publicName"]'))).sendKeys(string)
});

When('I enter {string} in the internal name field', async function (string) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "internalName"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE))
    await driver.wait(until.elementLocated(By.css('[data-testid = "internalName"]'))).sendKeys(string)
});

When('I enter {string} in the Description field', async function (string) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "description"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE))
    await driver.wait(until.elementLocated(By.css('[data-testid = "description"]'))).sendKeys(string)
});

When('I select {string} from the asset type dropdown', async function (asset) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    if (asset != '') {
        await driver.wait(until.elementLocated(By.css('[data-testid = "drop-btn"]'))).click();
        await driver.wait(until.elementLocated(By.css('[data-testid = "asset-0"]'))).click();
    }
});

When('I select {string} from the questionnaire type options', async function (string) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    if (string === "") {
        return;
    } else {
        await driver.wait(until.elementLocated(By.css(`[data-testid="${string}"]`))).click();
    }
});

When('I select {string} from the Language dropdown', async function (language) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "language-drop-btn"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid="language-0"]'))).click();
});

When('I click the create questionnaire button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="createQuestionnaireBtn"]'))).click();
});

Given('I am on the questionnaire creation screen', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Create Questionnaire"]')));
});

When('I enter Unique Public Name in the public name field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const publicName = `bddtest${faker.string.alphanumeric(5)}`; // Use random.alphaNumeric
    global.publicNameStatus = publicName;
    await driver.wait(until.elementLocated(By.css('[data-testid = "publicName"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE), publicName);
});

When('I enter internal name in the internal name field', async function () {
    const internalName = `Inspection${faker.string.alpha(4)}`; // Correct method for alphanumeric string   faker.company.name()
    global.internalName = internalName;
    await driver.wait(until.elementLocated(By.css('[data-testid = "internalName"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE), internalName);
});

When('I enter questionnaire description in the Description field as {string}', async function (string) {
    await driver.wait(until.elementLocated(By.css('[data-testid = "description"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE), string);
});

When('I select door from the asset type dropdown', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "drop-btn"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid = "asset-0"]'))).click();
});

When('I select british english from the language dropdown', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "language-drop-btn"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid = "language-0"]'))).click();
});

When('I select {string} from service record list', async function (service_record) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "services_type-drop-btn"]'))).click();
    switch (service_record) {
    case "FABRICATION":
        await driver.wait(until.elementLocated(By.css('[data-testid="services_type-0"]'))).click();
        break;

    case "INSTALLATION":
        await driver.wait(until.elementLocated(By.css('[data-testid="services_type-1"]'))).click();
        break;

    case "INSPECTION":
        await driver.wait(until.elementLocated(By.css('[data-testid="services_type-2"]'))).click();
        break;

    case "MAINTENANCE":
        await driver.wait(until.elementLocated(By.css('[data-testid="services_type-3"]'))).click();
        break;

    default:
        throw new Error(`Unsupported service record: ${service_record}`);
    }

});