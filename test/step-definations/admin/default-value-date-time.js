const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Then('I should see the default value advanced editor for date\\/time field', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Default Value"]')));
});

Then('I should see the default value suggestions for questions for date\\/time', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    let bool = true;
    let suggestions = ['Section_1.Page_1.Date_or_time'];
    let i = 0;
    while (bool && i < suggestions.length) {
        let suggestion = await driver.wait(until.elementLocated(By.css(`[data-testid="suggestion-${i}"]`)), 10000).getText();

        if (suggestion === suggestions[i]) {
            bool = false;
        }
        i++;
    }
});

When('I enter the incorrect default value conditional logic for date\\/time field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Random_Question > 10');
});

When('I select the question from the default value suggestions for date\\/time field', async function () {
    let bool = true;
    let suggestions = ['Section_1.Page_1.Date_or_time'];
    let i = 0;

    // eslint-disable-next-line max-len
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('if (Section_1.Page_1.Date_or_time.AddDays(5) AND ', Key.RETURN);
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

    let conditions = ['AddDays()',
        'SubtractDays()',
        'getFullYear()',
        'getMonth()',
        'getDate()',
        'getDay()',
        'getHours()',
        'getMinutes()',
        'getSeconds()',
        'getMilliseconds()',
        'getTime()',
        'Date()'];

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

    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-11"]`)), 10000).click();

    const element = await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`)));
    // Move the cursor one character to the left using the LEFT arrow key
    console.log('passed condition 1');
    await new Promise((resolve) => setTimeout(resolve, 750));
    await element.sendKeys(Key.ARROW_LEFT);
    console.log('passed condition 2');
    // Type '10' where the cursor is now placed
    await new Promise((resolve) => setTimeout(resolve, 750));
    await element.sendKeys('31/10/2024');
    await element.sendKeys(Key.ARROW_RIGHT);

    await new Promise((resolve) => setTimeout(resolve, 750));
    await element.sendKeys(') then "Within Deadline" else "Crossed Deadline"');
    console.log('passed condition 5');
});

When('I enter the default value correct conditional logic for date\\/time field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const default_value = `if (Section_1.Page_3.Date_or_time === "Today") then Date(7/14/2022) else Date()`;
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(default_value);
    this.default_value = default_value;
});

Then('I should see the conditional logic in default value field for date\\/time', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    // eslint-disable-next-line max-len
    const default_value = await driver.wait(until.elementLocated(By.css('[data-testid="default-value-input"]'))).getAttribute('value');
    assert.equal(default_value, this.default_value);
});