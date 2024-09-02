/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber');
const { resolve } = require('path');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I click the number button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="number"]`))).click();
});

Then('I should see the number field added to the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"] [data-testid="number-field"]`)));
});

When('I enter the label name for number', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    labelNameInput.sendKeys('Sample Number Label Name');
    this.labelName = 'Sample Number Label Name';
});

Then('I should see the label name for number updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, this.labelName);
});

When('I enter the help text for number', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    await helpTextInput.sendKeys('Sample Number help Name');
    this.helpText = 'Sample Number help Name';
});

Then('I should see the help text for number updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.helpText);
});

When('I enter the placeholder content for number', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    await placeholderTextInput.sendKeys('Sample Number placeholder Name');
    this.placeholder = 'Sample Number placeholder Name';
});

Then('I should see the placeholder content for number updated in the section {int}', async function (int) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, this.placeholder);
});

When('I enter the minimum and maximum range', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="minChar"]'))).sendKeys('10');
    await driver.wait(until.elementLocated(By.css('[data-testid="maxChar"]'))).sendKeys('500');
});

When('I enter the increment by number', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="increment"]'))).sendKeys('5');
});

When('I enter the pre-field text', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="pre-field-option"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid="field-text"]'))).sendKeys('$');
});

When('I enter the post-field text', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="post-field-option"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid="field-text"]'))).sendKeys('500');
});

When('I select the type for number as {string}', async function (numberType) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="${numberType}"]`))).click();
});

When('I select the source for number as {string}', async function (source) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="${source}"]`))).click();
    this.source = source;
});

Then('I should see the source added to question {int} page {int} section {int}', async function (questionNumber, pageNumber, sectionNumber) {
    if (this.source === 'Entry Field' || this.source === 'Slider') {
        await new Promise(resolve => setTimeout(resolve, 750));
        await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"] [data-testid="${this.source}"]`)));
    }
    else {
        await new Promise(resolve => setTimeout(resolve, 750));
        await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"] [data-testid="Entry Field"]`)));
        await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"] [data-testid="Slider"]`)));
    }
});
