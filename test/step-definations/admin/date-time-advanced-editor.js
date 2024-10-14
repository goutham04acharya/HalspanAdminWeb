const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Then('I should see the advanced editor for date\\/time field', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="advance-editor-tab"]`))).click();
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="shows when..."]')));
});

When('I enter the correct conditional logic for date\\/time field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Date_or_time.setDate(20)');
});

When('I select the question from the suggestions for date\\/time field', async function () {
    let bool = true;
    let suggestions = ['Section_1.Page_1.Date_or_time'];
    let i = 0;

    // eslint-disable-next-line max-len
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Date_or_time.setDate(20) AND ', Key.RETURN);
    await new Promise(resolve => setTimeout(resolve, 1000));
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

    await new Promise(resolve => setTimeout(resolve, 1000));
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-0"]`)), 10000).click();

    const element = await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`)));
    // Move the cursor one character to the left using the LEFT arrow key
    console.log('passed condition 1');
    await new Promise((resolve) => setTimeout(resolve, 750));
    await element.sendKeys(Key.ARROW_LEFT);
    console.log('passed condition 2');
    // Type '10' where the cursor is now placed
    await new Promise((resolve) => setTimeout(resolve, 750));
    await element.sendKeys('10');
    console.log('passed condition 3');
});


When('I enter the incorrect conditional logic for date\\/time field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_Number_Label_Name > 10');
});
