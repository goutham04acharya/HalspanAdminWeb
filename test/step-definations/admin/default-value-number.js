const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Then('I should see the default value advanced editor for number field', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Default Value"]')));
});

Then('I should see the default value suggestions for questions for number', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    let bool = true;
    let suggestions = ['Section_1.Page_1.Sample_Number_Label_Name'];
    let i = 0;
    while (bool && i < suggestions.length) {
        let suggestion = await driver.wait(until.elementLocated(By.css(`[data-testid="suggestion-${i}"]`)), 10000).getText();

        if (suggestion === suggestions[i]) {
            bool = false;
        }
        i++;
    }
});

When('I enter the incorrect default value conditional logic for number field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Random_Question > 10');
});

When('I select the question from the default value suggestions for number field', async function () {
    let bool = true;
    let suggestions = ['Section_1.Page_1.Sample_Number_Label_Name'];
    let i = 0;

    // eslint-disable-next-line max-len
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('if (Section_1.Page_1.Sample_Number_Label_Name >= 18 AND ', Key.RETURN);
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
    const conditional_logic = await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`)));
    await conditional_logic.sendKeys('< 60) then "You are eligible" else "You are not eligible"');

});

When('I enter the default value correct conditional logic for number field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const default_value = `if (Section_1.Page_1.Sample_Number_Label_Name >= 18) then "20"   else   "18"`;
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(default_value);
    this.default_value = default_value;
});

Then('I should see the conditional logic in default value field for number', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    // eslint-disable-next-line max-len
    const default_value = await driver.wait(until.elementLocated(By.css('[data-testid="default-value-input"]'))).getAttribute('value');
    assert.equal(default_value, this.default_value);
});
