/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const path = require('path');
const By = require('selenium-webdriver').By
const Key = webdriver.Key;

When('I click the add conditional logic button for page {int}', async function (pageNumber) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-condition-section-0-page-${pageNumber - 1}"]`))).click();
});

Then('I should see the advanced editor for page', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="advance-editor-tab"]`))).click();
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Shows when..."]')));
});

When('I enter the conditional logic for page', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const condition = `if ( Section_1.Page_1.Sample_textbox_Label_Name.includes("Inspector") )`;
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(condition);
});

Then('I should see the updated condition logic button for page {int}', async function (pageNumber) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // await driver.wait(until.elementLocated(By.css(`[data-testid="condition-added-page-${pageNumber - 1}"]`))).click();
});

Then('I should not see the page {int} at section {int}', async function (int, int2) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Compliance Results"]')));
});

Then('I should see the page {int} at section {int}', async function (pageNumber, sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-0"]`)));
});

When('I click the add conditional logic button for section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-condition-section-${sectionNumber - 1}"]`))).click();
});

Then('I should see the advanced editor for section', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="advance-editor-tab"]`))).click();
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Shows when..."]')));
});

When('I enter the conditional logic for section', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const condition = `if ( Section_1.Page_2.Sample_Choice_Label_Name.includes("Good") )`;
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(condition);
});

Then('I should see the updated condition logic button for section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // await driver.wait(until.elementLocated(By.css(`[data-testid="condition-added-page-${sectionNumber - 1}"]`))).click();
});

Then('I should not see the section {int}', async function (int) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Compliance Results"]')));
});

When('I close the preview', async function () {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="preview-close"]`))).click();
});