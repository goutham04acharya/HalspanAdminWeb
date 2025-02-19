/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

// eslint-disable-next-line max-len
When('I should see the textbox field added to the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line max-len
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"]`)));
});

Then('I should see the default value advanced editor for textbox field', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Default Value"]')));
});

Then('I should see the default value suggestions for questions for textbox', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    let bool = true;
    let suggestions = ['Section_1.Page_1.Sample_Label_Name'];
    let i = 0;
    while (bool && i < suggestions.length) {
        let suggestion = await driver.wait(until.elementLocated(By.css(`[data-testid="suggestion-${i}"]`)), 10000).getText();

        if (suggestion === suggestions[i]) {
            bool = false;
        }
        i++;
    }
});

When('I enter the incorrect default value conditional logic for textbox field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Random_Question > 10');
});

When('I select the question from the default value suggestions for textbox field', async function () {
    let bool = true;
    let suggestions = ['Section_1.Page_1.Sample_Label_Name'];
    let i = 0;

    // eslint-disable-next-line max-len
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('if (Section_1.Page_1.Sample_Label_Name.includes("Roopesh") AND ', Key.RETURN);
    await new Promise(resolve => setTimeout(resolve, 750));
    while (bool) {
        let suggestionElement = await driver.wait(until.elementLocated(By.css(`[data-testid="suggestion-${i}"]`)), 10000);
        let suggestionText = await suggestionElement.getText();
        console.log("suggestionText = ", suggestionText, "suggestions[0] = ", suggestions[0]);
        if (suggestionText === suggestions[0]) {
            await suggestionElement.click();
            bool = false;
        }
        i++;
    }

    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('.');

    let conditions = ['toUpperCase()', 'toLowerCase()', 'trim()','includes()'];

    bool = true;
    i = 0;

    while (i < conditions.length) {
        let conditionElement = await driver.wait(until.elementLocated(By.css(`[data-testid="condition-${i}"]`)), 10000);
        let conditionText = await conditionElement.getText();
        assert.equal(conditionText, conditions[i]);

        // if (conditionText === conditions[i]) {
        //     await conditionElement.click();
        //     bool = false;
        // }
        i++;
    }

    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-3"]`)), 10000).click();
    // eslint-disable-next-line max-len
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(') then "hi roopesh" else "hello mate"');
});

When('I enter the default value correct conditional logic for textbox field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const default_value = `if (Section_1.Page_1.Sample_Label_Name === "India") then "INR"   else   "USD"`;
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)

    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(default_value);
    this.default_value = default_value;
});

Then('I should see the conditional logic in default value field for textbox', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    // eslint-disable-next-line max-len
    const default_value = await driver.wait(until.elementLocated(By.css('[data-testid="default-value-input"]'))).getAttribute('value');
    assert.equal(default_value, this.default_value);
});
