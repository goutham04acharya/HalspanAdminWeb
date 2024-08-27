/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber');
const { resolve } = require('path');
const webdriver = require('selenium-webdriver')
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key

When('I click the date\\/time button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="date-/-time"]`))).click();
});

Then('I should see the date\\/time field added to the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"]`)));
});

When('I click the type as {string}', async function (dateTimeType) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="${dateTimeType}"]`))).click();
});

When('I click the time format as {string}', async function (timeFormat) {
    await new Promise(resolve => setTimeout(resolve, 750));
    if (timeFormat === "") {
        console.log("do not have time");
    } else {
        await driver.wait(until.elementLocated(By.css(`[data-testid="format-${timeFormat}"]`))).click();
    }
});

When('I enter the label name for date\\/time', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.labelName = 'Date or time';
    await labelNameInput.sendKeys(this.labelName);
});

Then('I should see the label name for date\\/time updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));           
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.labelName);
    assert.equal(labelNameText, this.labelName);
});

When('I enter the help text for date\\/time', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.helpText = 'Enter the date/time in dd/mm/yyyy format';
    await helpTextInput.sendKeys(this.helpText);
});

Then('I should see the help text for date\\/time updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.helpText);
});

When('I enter the placeholder content for date\\/time', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    this.placeholder = 'dd-mm-yyyy';
    await placeholderTextInput.sendKeys(this.placeholder);
});

Then('I should see the placeholder content for date\\/time updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, this.placeholder);
});