const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Then('I should see an add field section', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="add-field"]')));
});

When('I click the textbox button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const textboxButton = await driver.wait(until.elementLocated(By.css('[data-testid="textbox"]')));
    await textboxButton.click();
});

Then('I should see field settings', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="field-settings"]')));
});

Then('I should see the text box added to the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="textbox-${sectionNumber}"]`)));
});

When('I enter the label name for textbox', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    this.labelName = await labelNameInput.sendKeys('Sample Label Name');
});

Then('I should see the label name updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="label-name-${sectionNumber}"]`)));
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, this.labelName);
});

When('I enter the help text for textbox', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.helpText = await helpTextInput.sendKeys('Sample Help Text');
});

Then('I should see the help text updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="help-text-${sectionNumber}"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.helpText);
});

When('I enter the placeholder content for textbox', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    this.placeholder = await placeholderInput.sendKeys('Sample Placeholder');
});

Then('I should see the placeholder content updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="placeholder-${sectionNumber}"]`)));
    const placeholderText = await placeholder.getText();
    assert.equal(placeholderText, this.placeholder);
});

When('I select the type as {string}', async function (type) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="${type}"]`))).click();
});

When('I select the format as {string}', async function (format) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="format"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="format-${format}"]`))).click();
});

Then('I should see the format reflected on the text box', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // Add assertion to check format on the text box
});

When('I enter the minimum and maximum number of characters', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="min-char-input"]'))).sendKeys('10');
    await driver.wait(until.elementLocated(By.css('[data-testid="max-char-input"]'))).sendKeys('500');
});

When('I enter the admin field notes', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="admin-notes-input"]'))).sendKeys('Sample Admin Notes');
});

When('I select a lookup data from the dropdown', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="lookup-dropdown"]')));
    await driver.wait(until.elementLocated(By.css('[data-testid="lookup-1"]')));
});
