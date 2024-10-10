const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Then('I should see the basic editor for textfield', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    const texts = ['Basic Editor', 'Select', 'Condition', 'Value'];
    for (let i = 0; i < texts.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await driver.wait(until.elementLocated(By.xpath(`//*[text()="${texts[i]}"]`)), 10000);
    }
});

// Helper function to select an option from a dropdown
async function selectDropdown(selectTestId, dropdownPrefix, optionText) {
    await driver.wait(until.elementLocated(By.css(`[data-testid="${selectTestId}"]`)), 10000).click();

    let bool = true;
    let index = 0;

    while (bool) {
        let option = await driver.wait(until.elementLocated(By.css(`[data-testid="${dropdownPrefix}-${index}"]`)), 10000);
        let optionTextValue = await option.getText();

        if (optionTextValue === optionText) {
            await option.click();
            bool = false;
        }
        index++;
    }
}

// Helper function to enter value into an input field
async function enterValue(inputTestId, value) {
    await driver.wait(until.elementLocated(By.css(`[data-testid="${inputTestId}"]`)), 5000).sendKeys(value);
}

// Step definition for entering correct conditional logic
When('I enter the correct conditional logic for basic editor', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));  // Adding delay

    // First condition (select and condition)
    await selectDropdown('select-0-0', 'select-dropdown-0-0', 'Section_1.Page_1.Sample_Label_Name');
    await selectDropdown('condition-0-0', 'condition-dropdown-0-0', 'equals');
    await enterValue('value-input-0-0', '200');
    await driver.wait(until.elementLocated(By.css('[data-testid="AND-0"]')), 5000).click();  // Add AND condition

    await new Promise((resolve) => setTimeout(resolve, 750));
    // Second AND condition
    await selectDropdown('select-0-1', 'select-dropdown-0-1', 'Section_1.Page_1.Sample_Label_Name');
    await selectDropdown('condition-0-1', 'condition-dropdown-0-1', 'does not include');
    await enterValue('value-input-0-1', '1500');
    await driver.wait(until.elementLocated(By.css('[data-testid="OR-0"]')), 5000).click();  // Add OR condition

    await new Promise((resolve) => setTimeout(resolve, 750));
    // Third condition (OR)
    await selectDropdown('select-1-0', 'select-dropdown-1-0', 'Section_1.Page_1.Sample_Label_Name');
    await selectDropdown('condition-1-0', 'condition-dropdown-1-0', 'includes');
    await enterValue('value-input-1-0', '200');
    await driver.wait(until.elementLocated(By.css('[data-testid="AND-1"]')), 5000).click();  // Add AND condition

    await new Promise((resolve) => setTimeout(resolve, 750));
    // Fourth AND condition
    await selectDropdown('select-1-1', 'select-dropdown-1-1', 'Section_1.Page_1.Sample_Label_Name');
    await selectDropdown('condition-1-1', 'condition-dropdown-1-1', 'not equal to');
    await enterValue('value-input-1-1', '1500');
});
