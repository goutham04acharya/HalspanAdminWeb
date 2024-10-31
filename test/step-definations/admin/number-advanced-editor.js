const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Then('I should see the advanced editor for number field', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="advance-editor-tab"]`))).click();
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Shows when..."]')));
});

When('I enter the correct conditional logic for number field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_Number_Label_Name > 10');
});

When('I enter the incorrect conditional logic for number field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.includes("Roopesh")');
});

When('I select the question from the suggestions for number field', async function () {
    let bool = true;
    let suggestions = ['Section_1.Page_1.Sample_Number_Label_Name'];
    let i = 0;

    // eslint-disable-next-line max-len
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_Number_Label_Name > 10 AND ', Key.RETURN);
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('< 20');
});