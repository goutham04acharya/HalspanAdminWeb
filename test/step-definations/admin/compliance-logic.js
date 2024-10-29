const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key

When('I enter the label name for compliance status', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    labelNameInput.sendKeys('Compliance Logic Label Name');
    this.labelName = 'Compliance Logic Label Name';
});

Then('I should see the compliance logic advanced editor for choice field', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="shows when..."]')));
});

Then('I should see the compliance logic suggestions for questions for choice', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    let bool = true;
    let suggestions = ['Section_1.Page_1.Sample_Choice_Label_Name'];
    let i = 0;
    while (bool && i < suggestions.length) {
        let suggestion = await driver.wait(until.elementLocated(By.css(`[data-testid="suggestion-${i}"]`)), 10000).getText();

        if (suggestion === suggestions[i]) {
            bool = false;
        }
        i++;
    }
});

When('I enter the incorrect compliance logic for choice field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line 
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Random_Question > 10');
});

Then('I click the save button for compliance logic', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="save-conditional-logic"]'))).click();
});

When('I select the question from the compliance logic suggestions for choice field', async function () {
    let bool = true;
    let suggestions = ['Section_1.Page_1.Sample_Choice_Label_Name'];
    let i = 0;

    // eslint-disable-next-line max-len
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('if (Section_1.Page_1.Sample_Choice_Label_Name.includes("Roopesh") AND ', Keys.RETURN);
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
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(') then "Yes" else "No"');
});

When('I enter the correct compliance logic for choice field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const default_value = `if (Section_1.Page_1.Sample_Choice_Label_Name === "India") then "Yes" else "No"`;
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(default_value);
    this.default_value = default_value;
});

Then('I should see the compliance logic in default value field', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    // eslint-disable-next-line max-len
    const default_value = await driver.wait(until.elementLocated(By.css('[data-testid="default-value-input"]'))).getAttribute('value');
    assert.equal(default_value, this.default_value);
});

When('I click the add compliance button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="compliance"]'))).click();
}); 