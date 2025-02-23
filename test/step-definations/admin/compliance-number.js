/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const moment = require('moment'); // Import moment for date formatting
const Keys = webdriver.Key

When('I set the compliance condition for date {string}', async function (condition) {
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
    case 'date is before today':
        console.log(condition);
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-0"]'))).click();
        break;

    case 'date is before or equal to today':
        console.log(`Condition: ${condition}`);
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-1"]'))).click();
        break;
        
    case 'date is after today':
        console.log(condition);
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-2"]'))).click();
        break;

    case 'date is after or equal to today':
        console.log(condition);
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-3"]'))).click();
        break;

    case 'date is "X" date of set date':
        console.log(condition);
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0-0-4"]'))).click();
        break;

    default:
        console.error('Invalid condition provided');
    }

    console.log('pass 4')
    // await new Promise(resolve => setTimeout(resolve, 250));
    // await driver.wait(until.elementLocated(By.css(`[data-testid="value-input-0-0"]`))).sendKeys('yes');
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

Then('I should see the date basic editor compliance logic for {string} in default value field', async function (conditionType) {
    await new Promise(resolve => setTimeout(resolve, 950));

    let condition;
    switch (conditionType) {
    case 'date is before today':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Date_or_time < new Date()) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'date is before or equal to today':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Date_or_time <= new Date()) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'date is after today':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Date_or_time > new Date()) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

    case 'date is after or equal to today':
        console.log(conditionType);
        condition = `if (Section_1.Page_1.Date_or_time >= new Date()) then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        break;

        // case 'date is "X" date of set date':
        //     condition = `if (Section_1.Page_1.Sample_Label_Name === "2024-12-31") then (STATUS = 'PASS', GRADE = 'Good') else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
        //     break;

    default:
        throw new Error(`Invalid condition type: ${conditionType}`);
    }
    console.log(condition);
    const default_value = await driver
        .wait(until.elementLocated(By.css('[data-testid="default-value-input"]')))
        .getAttribute('value');

    assert.equal(default_value, condition, `Expected ${condition} but got ${default_value}`);
});

When('I enter invalid date for compliance for section {int} page {int} question {int} with condition {string}', async function (sectionNumber, pageNumber, questionNumber, condition) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${questionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);

    // Determine an invalid date based on the condition
    let invalidDate;
    switch (condition) {
    case 'date is before today':
        invalidDate = moment().add(1, 'days').format('DD/MM/YYYY'); // Tomorrow (invalid for "before today")
        console.log(invalidDate ,"invalidDate")
        invalidDate = '30/12/2025'
        break;
    case 'date is before or equal to today':
        invalidDate = moment().add(2, 'days').format('DD/MM/YYYY'); // Tomorrow (invalid for "before or equal to today")
        console.log(invalidDate ,"invalidDate")
        invalidDate = '30/12/2025'
        break;
    case 'date is after today':
        invalidDate = moment().subtract(2, 'days').format('DD/MM/YYYY'); // Yesterday (invalid for "after today")
        console.log(invalidDate ,"invalidDate")
        invalidDate = '01/01/2025'

        break;
    case 'date is after or equal to today':
        invalidDate = moment().subtract(2, 'days').format('DD/MM/YYYY'); // Yesterday (invalid for "after or equal to today")
        console.log(invalidDate ,"invalidDate")
        invalidDate = '01/01/2025'
        break;
    case 'date is "X" date of set date':
        invalidDate = '99/99/9999'; // Clearly invalid date format\        console.log(invalidDate ,"invalidDate")
        console.log(invalidDate ,"invalidDate")
        break;
    default:
        throw new Error(`Invalid condition type: ${condition}`);

    }

    await text_area.sendKeys(Keys.chord(Keys.ENTER, invalidDate));
});

When('I enter the date for compliance in date field for section {int} page {int} question {int} with condition {string}', async function (sectionNumber, pageNumber, questionNumber, condition) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${questionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);

    // Get today's date in dd/mm/yyyy format
    const today = moment().format('DD/MM/YYYY');

    // Set date based on the condition
    let inputDate;
    switch (condition) {
    case 'date is before today':
        inputDate = moment().subtract(2, 'days').format('DD/MM/YYYY'); // Yesterday
        console.log(inputDate ,"invalidDate")
        inputDate = '01/01/2025'
        break;
    case 'date is before or equal to today':
        inputDate = today; // Today (valid case)
        console.log(inputDate ,"invalidDate")
        inputDate = '01/01/2025'
        break;
    case 'date is after today':
        inputDate = moment().add(2, 'days').format('DD/MM/YYYY'); // Tomorrow
        console.log(inputDate ,"invalidDate")
        inputDate = '30/12/2025'
        break;
    case 'date is after or equal to today':
        inputDate = today; // Today (valid case)
        console.log(inputDate ,"invalidDate")
        inputDate = '30/12/2025'
        break;
    case 'date is "X" date of set date':
        inputDate = '31/12/2024'; // Example fixed date
        console.log(inputDate ,"invalidDate")
        break;
    default:
        throw new Error(`Invalid condition type: ${condition}`);
    }

    await text_area.sendKeys(inputDate);
});

When('I set the compliance condition for number {string}', function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});
       
Then('I should see the number basic editor compliance logic for {string} in default value field', function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});
       
When('I enter the number for compliance in number field for section {int} page {int} question {int} with condition {string}', function (int, int2, int3, string) {
    return 'pending';
});
    
When('I enter invalid number for compliance for section {int} page {int} question {int} with condition {string}', function (int, int2, int3, string) {
    return 'pending';
});