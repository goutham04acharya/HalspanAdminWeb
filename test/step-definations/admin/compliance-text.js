/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key

When('I set the compliance condition for {string}', async function (condition) {
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="select-0-0"]`))).click();
    console.log('pass 1')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="select-dropdown-0-0-0"]`))).click();
    console.log('pass 2')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-0-0"]`))).click();
    console.log('pass 3')
    switch (condition) {
    case 'includes':
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-0"]'))).click();
        break;

    case 'does not include':
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-1"]'))).click();
        break;

    case 'equals':
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-2"]'))).click();
        break;

    case 'not equal to':
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-3"]'))).click();
        break;

    default:
        console.error('Invalid condition provided');
    }
    console.log('pass 4')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="value-input-0-0"]`))).sendKeys('yes');
    console.log('pass 5')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="status-dropdown-0"]`))).click();
    console.log('pass 6')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="status-dropdown-label-0"]`))).click();
    console.log('pass 7')
    await new Promise(resolve => setTimeout(resolve, 250));
    // form here
    await driver.wait(until.elementLocated(By.css(`[data-testid="grade-0"]`))).sendKeys('Good');
    console.log('pass 8')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-status-dropdown"]`))).click();
    console.log('pass 10')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-status-dropdown-label-1"]`))).click();
    console.log('pass 11')
    console.log('pass 12')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-reason-dropdown"]`))).click();
    console.log('pass 13')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-reason-dropdown-label-0"]`))).click();
    console.log('pass 14')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-action"]`))).sendKeys('Replace');
});

Then('I should see the text basic editor compliance logic for {string} in default value field', async function (conditionType) {
    await new Promise(resolve => setTimeout(resolve, 950));

    let condition;
    switch (conditionType) {
    case 'includes':
        condition = `if (Section_1.Page_1.Sample_Label_Name.includes("yes")) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'does not include':
        condition = `if (!Section_1.Page_1.Sample_Label_Name.includes("yes")) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'equals':
        condition = `if (Section_1.Page_1.Sample_Label_Name === "yes") then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'not equal to':
        condition = `if (Section_1.Page_1.Sample_Label_Name !== "yes") then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    default:
        throw new Error(`Invalid condition type: ${conditionType}`);
    }

    const default_value = await driver
        .wait(until.elementLocated(By.css('[data-testid="default-value-input"]')))
        .getAttribute('value');

    assert.equal(default_value, condition, `Expected ${condition} but got ${default_value}`);
});



When('I enter invalid text for compliance custom regular expression for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await text_area.sendKeys('hdhsdshsjdhsj');
});

When('I enter the text for compliance in textbox for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await text_area.sendKeys('yes');
});

When('I refresh the page', async function () {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await driver.navigate().refresh();
});