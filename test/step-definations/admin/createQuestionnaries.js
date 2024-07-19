/* eslint-disable max-len */
const assert = 'assert';
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const keys = webdriver.Key
const faker = require('@faker-js/faker');

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
    await driver.wait(until.elementLocated(By.css('[data-testid = "publicName"]'))).sendKeys(string);
});

When('I enter {string} in the internal name field', async function (string) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "internalName"]'))).sendKeys(string);
});

When('I enter {string} in the Description field', async function (string) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "description"]'))).sendKeys(string);
});

When('I select {string} from the asset type dropdown', async function (asset) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "drop-btn"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid = "option0"]'))).click();
});

When('I select {string} from the questionnaire type options', async function (string) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid = "${string}"]`))).click();
});

When('I select {string} from the Language dropdown', async function (language) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "language-drop-btn"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid = "language0"]'))).click();
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
    const publicName = `test+${faker.string.alphanumeric(5)}`; // Correct method for alphanumeric string
    await driver.wait(until.elementLocated(By.css('[data-testid = "publicName"]'))).sendKeys(publicName);
});

When('I enter internal name in the internal name field', async function () {
    const internalName = `test+${faker.string.alphanumeric(5)}`; // Correct method for alphanumeric string   faker.company.name()
    await driver.wait(until.elementLocated(By.css('[data-testid = "internalName"]'))).sendKeys(internalName);
});

When('I enter a large Description', async function () {
    const description = "This is a very long description that exceeds 500 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet accumsan arcu. Curabitur dignissim scelerisque metus, ac scelerisque risus elementum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean ut metus et quam ullamcorper dapibus nec ut mauris. Morbi tincidunt, dui non bibendum auctor, nisi erat placerat felis, non venenatis ipsum nibh non purus. Vivamus scelerisque quam sit amet sapien laoreet, ut luctus magna cursus. Vestibulum aliquet, purus nec ultrices cursus, risus urna ultrices quam, nec feugiat tortor mi a odio.";
    await driver.wait(until.elementLocated(By.css('[data-testid = "description"]'))).sendKeys(description);
});

When('I enter questionnaire description in the Description field as {string}', async function (string) {
    await driver.wait(until.elementLocated(By.css('[data-testid = "description"]'))).sendKeys(string);
});

When('I select door from the asset type dropdown', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "drop-btn"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid = "option1"]'))).click();
});

When('I select british english from the language dropdown', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "language-drop-btn"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid = "language0"]'))).click();
});
