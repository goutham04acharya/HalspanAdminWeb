/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const path = require('path');
const By = require('selenium-webdriver').By
const Key = webdriver.Key;

Then('I should see the questions in editor', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="select-0-0"]`))).click();
    const question = await driver.wait(until.elementLocated(By.css(`[data-testid="select-dropdown-0-0-0"]`))).getText();    
    assert.equal(question, 'Section_1.Page_1.Sample_Label_Name');
});

When('I enter the conditional logic for choice field', async function() {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('if ( ');
    await driver.wait(until.elementLocated(By.css(`[data-testid="suggestion-0"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('.');
    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-3"]`))).click();    
    for(let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 750));
        let choice = await driver.wait(until.elementLocated(By.css(`[data-testid="choicevalues-${i}"]`))).getText();
        if(i === 0) {
            assert.equal(choice, 'Good');
        } else if (i === 1) {
            assert.equal(choice, 'Satisfied');
        } else if (i === 2) {
            assert.equal(choice, 'Unsatisfied');
        }
    }
});

When('I try the choice for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const choices = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`)), 5000);
    await driver.wait(until.elementIsVisible(choices), 2000);
    await driver.wait(until.elementLocated(By.css(`[data-testid="lookup-dropdown"]`)), 5000).click();
} );