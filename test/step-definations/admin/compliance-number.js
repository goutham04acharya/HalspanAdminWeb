/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key

When('I set the compliance condition for number {string}', async function (condition) {
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="select-0-0"]'))).click();
    console.log('pass 1')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="select-dropdown-0-0-0"]'))).click();
    console.log('pass 2')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="condition-0-0"]'))).click();
    console.log('pass 3')
    switch (condition) {
    case 'equals':
        console.log(condition);
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-0"]'))).click();
        break;

    case 'not equal to':
        console.log(`Condition: ${condition}`);
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-1"]'))).click();
        break;
        
    case 'smaller':
        console.log(condition);
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-2"]'))).click();
        break;

    case 'larger':
        console.log(condition);
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-3"]'))).click();
        break;

    case 'smaller or equal':
        console.log(condition);
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-4"]'))).click();
        break;

    case 'larger or equal':
        console.log(condition);
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-5"]'))).click();
        break;

    default:
        console.error('Invalid condition provided');
    }
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="value-input-0-0"]`))).sendKeys('10');
    console.log('pass 4')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="status-dropdown-0"]'))).click();
    console.log('pass 6')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="status-dropdown-label-0"]'))).click();
    console.log('pass 7')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="grade-0"]'))).sendKeys('Good');
    console.log('pass 8')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="else-status-dropdown"]'))).click();
    console.log('pass 10')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="else-status-dropdown-label-1"]'))).click();
    console.log('pass 11')
    console.log('pass 12')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="else-reason-dropdown"]'))).click();
    console.log('pass 13')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="else-reason-dropdown-label-0"]'))).click();
    console.log('pass 14')
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css('[data-testid="else-action"]'))).sendKeys('Replace');
});
       
Then('I should see the number basic editor compliance logic for {string} in default value field', async function (conditionType) {
    await new Promise(resolve => setTimeout(resolve, 950));

    let condition;
    switch (conditionType) {
    case 'equals':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Sample_Number_Label_Name === "10") then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'not equal to':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Sample_Number_Label_Name !== "10") then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'smaller':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Sample_Number_Label_Name < 10) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'larger':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Sample_Number_Label_Name > 10) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'smaller or equal':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Sample_Number_Label_Name <= 10) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'larger or equal':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Sample_Number_Label_Name >= 10) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    default:
        throw new Error(`Invalid condition type: ${conditionType}`);
    }
    console.log(condition);
    const default_value = await driver
        .wait(until.elementLocated(By.css('[data-testid="default-value-input"]')))
        .getAttribute('value');

    assert.equal(default_value, condition, `Expected ${condition} but got ${default_value}`);
});
       
When('I enter the number for compliance in number field for section {int} page {int} question {int} with condition {string}', async function (sectionNumber, pageNumber, questionNumber, condition) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${questionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);

    // Determine a valid number based on the condition
    let validNumber;
    switch (condition) {
    case 'equals':
        validNumber = '10';
        break;
    case 'not equal to':
        validNumber = '11';
        break;
    case 'smaller':
        validNumber = '5';
        break;
    case 'larger':
        validNumber = '15';
        break;
    case 'smaller or equal':
        validNumber = '10';
        break;
    case 'larger or equal':
        validNumber = '10';
        break;
    default:
        throw new Error(`Invalid condition type: ${condition}`);
    }

    await text_area.sendKeys(Keys.chord(Keys.ENTER, validNumber));
});
    
When('I enter invalid number for compliance for section {int} page {int} question {int} with condition {string}', async function (sectionNumber, pageNumber, questionNumber, condition) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${questionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);

    // Determine an invalid number based on the condition
    let invalidNumber;
    switch (condition) {
    case 'equals':
        invalidNumber = '11'; // Any number not equal to 10
        break;
    case 'not equal to':
        invalidNumber = '10'; // The number we're checking against
        break;
    case 'smaller':
        invalidNumber = '15'; // Number larger than 10
        break;
    case 'larger':
        invalidNumber = '5'; // Number smaller than 10
        break;
    case 'smaller or equal':
        invalidNumber = '11'; // Number larger than 10
        break;
    case 'larger or equal':
        invalidNumber = '9'; // Number smaller than 10
        break;
    default:
        throw new Error(`Invalid condition type: ${condition}`);
    }

    await text_area.sendKeys(Keys.chord(Keys.ENTER, invalidNumber));
});