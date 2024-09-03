/* eslint-disable max-len */
const assert = require('assert');
const { When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I click the videos button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="video"]`))).click();
});

Then('I should see the videos field added to the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"]`)));
});

When('I enter the label name for videos', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.labelName = 'Video label name';
    await labelNameInput.sendKeys(this.labelName);
});

Then('I should see the label name for videos updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.labelName);
    assert.equal(labelNameText, this.labelName);
});

When('I enter the help text for videos', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.helpText = 'Supported formats: MP4, AVI, MOV';
    await helpTextInput.sendKeys(this.helpText);
});

Then('I should see the help text for videos updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.helpText);
});

When('I enter the minimum and maximum number of videos', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="minChar"]'))).sendKeys('1');
    await driver.wait(until.elementLocated(By.css('[data-testid="maxChar"]'))).sendKeys('5');
});

When('I enter the file size', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="file-size"]'))).sendKeys('10');
});