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
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Compliance Logic"]')));
});

Then('I should see the compliance logic suggestions for questions for choice', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    let logic = await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`)));
    await logic.sendKeys(Keys.CONTROL, 'a', Keys.DELETE);
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
    let logic = await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`)));
    await logic.sendKeys(Keys.CONTROL, 'a', Keys.DELETE);
    await logic.sendKeys('Section_1.Page_1.Random_Question > 10');
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

    let conditions = ['toUpperCase()', 'toLowerCase()', 'trim()', 'includes()'];

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
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys(') then "Yes" else "No"');
});

When('I enter the correct compliance logic for choice field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // eslint-disable-next-line max-len
    const default_value = `if ( Section_1.Page_1.Sample_Choice_Label_Name === "No"  ) then ( STATUS = "FAIL", REASON = "RECOMMEND_REPLACEMENT", ACTIONS += "Replace a new door" ) else ( STATUS = "PASS", GRADE = "1" )`;
    let logic = await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`)));
    await logic.sendKeys(Keys.CONTROL, 'a', Keys.DELETE);
    await logic.sendKeys(default_value);
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

When('I click the add default value button for compliance logic', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    await driver.wait(until.elementLocated(By.css(`[data-testid="default-value"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="advance-editor-tab"]`))).click();
});

Then('I should see the compliance status as {string}', async function (status) {
    await new Promise(resolve => setTimeout(resolve, 950));
    await driver.wait(until.elementLocated(By.css(`[data-testid="${status}"]`)));
});

Then('I should see the actions and reason', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    await driver.wait(until.elementLocated(By.xpath(`//*[text()="Recommend Replacement"]`)));
    await driver.wait(until.elementLocated(By.xpath(`//*[text()="Replace a new door"]`)));
});

When('I select the condition from basic editor', async function () {
    let i = 0;
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="select-0-0"]`))).click();
    console.log('pass 1');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="select-dropdown-0-0-0"]`))).click();
    console.log('pass 2');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-0-0"]`))).click();
    console.log('pass 3');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-dropdown-0-0-0"]`))).click();
    console.log('pass 4');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="value-dropdown-0-0"]`))).click();
    console.log('pass 5');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="value-dropdown-0-0-0"]`))).click();
    console.log('pass 6');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="status-dropdown-0"]`))).click();
    console.log('pass 7');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="status-dropdown-label-0"]`))).click();
    console.log('pass 8');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="grade-0"]`))).sendKeys('A');
    console.log('pass 9');
    // Add else if condition
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-if"]`))).click();
    console.log('pass else if 1');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="elseif-select-0-0-0"]`))).click();
    console.log('pass else if 2');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="select-dropdown-0-0-0"]`))).click();
    console.log('pass else if 3');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="elseif-condition-0-0-0"]`))).click();
    console.log('pass else if 4');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-dropdown-0-0-0"]`))).click();
    console.log('pass else if 5');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="elseif-value-dropdown-0-0-0"]`))).click();
    console.log('pass else if 6');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="value-dropdown-2"]`))).click();
    console.log('pass else if 7');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="elseif-status-dropdown-0"]`))).click();
    console.log('pass else if 8');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="status-dropdown-label-1"]`))).click();
    console.log('pass else if 9');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="reason-dropdown"]`))).click();
    console.log('pass else if 10');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="reason-dropdown-label-0"]`))).click();
    console.log('pass else if 11');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="elseif-action"]`))).sendKeys('A');
    console.log('pass else if 12');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-status-dropdown"]`))).click();
    console.log('pass 10');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-status-dropdown-label-1"]`))).click();
    console.log('pass 11');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-reason-dropdown"]`))).click();
    console.log('pass 12');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-reason-dropdown-label-0"]`))).click();
    console.log('pass 13');
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="else-action"]`))).sendKeys('Replace');
    console.log('pass 14');
});


When('I click add default value button for compliance logic', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    await driver.wait(until.elementLocated(By.css(`[data-testid="default-value"]`))).click();
});

Then('I should see the basic editor compliance logic in default value field', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    // eslint-disable-next-line max-len
    let condition = `if (Section_1.Page_1.Sample_Choice_Label_Name.includes("Yes")) then (STATUS = 'PASS', GRADE = 'A') else (Section_1.Page_1.Sample_Choice_Label_Name.includes("Maybe")) then (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "A") else (STATUS = 'FAIL', REASON = 'NO_ACCESS', ACTIONS += "Replace")`;
    // eslint-disable-next-line max-len
    const default_value = await driver.wait(until.elementLocated(By.css('[data-testid="default-value-input"]'))).getAttribute('value');
    assert.equal(default_value, condition);
});

Then('I should see the actions and reason for basic condition', async function () {
    await new Promise(resolve => setTimeout(resolve, 950));
    await driver.wait(until.elementLocated(By.xpath(`//*[text()="No Access"]`)));
    await driver.wait(until.elementLocated(By.xpath(`//*[text()="Replace"]`)));
});