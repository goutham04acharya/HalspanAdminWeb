const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click the add conditional logic button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-conditional-logic"]`))).click();
});

Then('I should see the advanced editor for textfield', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="shows when..."]')));
});

When('I enter the incorrect conditional logic', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.includes("Roopesh")');
});

When('I enter the correct conditional logic', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_Label_Name.includes("Roopesh")');
});

Then('I click the save button for conditional logic', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));  
    await driver.wait(until.elementLocated(By.css('[data-testid="save-conditional-logic"]'))).click();
    // await driver.wait(until.elementLocated(By.xpath('//button[text()="Save"]')), 10000).click();
});

Given('I am on the Questionnaire management sections', async function() {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Minerva Levy"]')));
});

Then('I should read a error message', async function() {
    await new Promise(resolve => setTimeout(resolve, 500));  
    await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')));
});

Then('I should see the suggestions for questions', async function () {
    let bool = true;
    let suggestions = ['Section_1.Page_1.Sample_Label_name'];
    let i = 0; 
    while (bool && i < suggestions.length) { 
        let suggestion = await driver.wait(until.elementLocated(By.css(`[data-testid="suggestion-${i}"]`)), 10000).getText();
        
        if (suggestion === suggestions[i]) {
            bool = false; 
        }
        i++;
    }
});

When('I select the question from the suggestions', async function () {
    let bool = true;
    let suggestions = ['Section_1.Page_1.Sample_Label_name'];
    let i = 0; 

    // eslint-disable-next-line max-len
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_Label_Name.includes("Roopesh") AND ');

    while (bool && i < suggestions.length) { 
        let suggestionElement = await driver.wait(until.elementLocated(By.css(`[data-testid="suggestion-${i}"]`)), 10000);
        let suggestionText = await suggestionElement.getText();
        
        if (suggestionText === suggestions[i]) {
            await suggestionElement.click();  
            bool = false;  
        }
        i++;
    } 

    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('.');

    // eslint-disable-next-line max-len
    let conditions = ['toUpperCase()', 'toLowerCase()', 'trim()', 'concat()', 'endsWith()', 'includes()', 'startsWith()', 'trimEnd()', 'trimStart()'];

    bool = true;
    i = 0; 

    while (bool && i < conditions.length) { 
        let conditionElement = await driver.wait(until.elementLocated(By.css(`[data-testid="condition-${i}"]`)), 10000);
        let conditionText = await conditionElement.getText();
        
        if (conditionText === conditions[i]) {
            await conditionElement.click(); 
            bool = false; 
        }
        i++;
    } 

    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-0"]`)), 10000).click();
});