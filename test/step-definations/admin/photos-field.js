/* eslint-disable max-len */
const assert = require('assert');
const { When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I click the photos button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="photo"]`))).click();
});

Then('I should see the photos field added to the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"]`)));
});

When('I enter the label name for photos', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.labelName = 'Photo label name';
    await labelNameInput.sendKeys(this.labelName);
});

Then('I should see the label name for photos updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));           
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.labelName);
    assert.equal(labelNameText, this.labelName);
});

When('I enter the help text for photos', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.helpText = 'Supported formats: JPG, PNG, GIF';
    await helpTextInput.sendKeys(this.helpText);
});

Then('I should see the help text for photos updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.helpText);
});

When('I enter the minimum and maximum number of photos', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="minChar"]'))).sendKeys('1');
    await driver.wait(until.elementLocated(By.css('[data-testid="maxChar"]'))).sendKeys('5');
});

When('I click the draw on image for photo as {string}', async function (image) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="draw-${image}"]`))).click();
});

When('I click the include metadata as {string}', async function (metadata) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="metadata-${metadata}"]`))).click();
});
