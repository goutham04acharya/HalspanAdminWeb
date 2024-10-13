const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

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

async function enterValue(inputTestId, value) {
    await driver.wait(until.elementLocated(By.css(`[data-testid="${inputTestId}"]`)), 5000).sendKeys(value);
}

When('I enter the correct date\\/time conditional logic for basic editor', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));  // Adding delay

    // First condition (select and condition)
    await selectDropdown('select-0-0', 'select-dropdown-0-0', 'Section_1.Page_1.Date_or_time');
    await selectDropdown('condition-0-0', 'condition-dropdown-0-0', 'date is before today');
    await driver.wait(until.elementLocated(By.css('[data-testid="AND-0"]')), 5000).click();  // Add AND condition
    
    
    await new Promise((resolve) => setTimeout(resolve, 750));
    // Second AND condition
    await selectDropdown('select-0-1', 'select-dropdown-0-1', 'Section_1.Page_1.Date_or_time');
    await selectDropdown('condition-0-1', 'condition-dropdown-0-1', 'date is before or equal to today');
    await driver.wait(until.elementLocated(By.css('[data-testid="OR-0"]')), 5000).click();  // Add OR condition

    await new Promise((resolve) => setTimeout(resolve, 750));
    // Third condition (OR)
    await selectDropdown('select-1-0', 'select-dropdown-1-0', 'Section_1.Page_1.Date_or_time');
    await selectDropdown('condition-1-0', 'condition-dropdown-1-0', 'date is after today'); 
    await driver.wait(until.elementLocated(By.css('[data-testid="AND-1"]')), 5000).click();  // Add AND condition

    await new Promise((resolve) => setTimeout(resolve, 750));
    // Fourth AND condition
    await selectDropdown('select-1-1', 'select-dropdown-1-1', 'Section_1.Page_1.Date_or_time');
    await selectDropdown('condition-1-1', 'condition-dropdown-1-1', 'date is after or equal to today');
    await driver.wait(until.elementLocated(By.css('[data-testid="OR-1"]')), 5000).click();  // Add AND condition

    await new Promise((resolve) => setTimeout(resolve, 750));
    // Fifth OR condition
    await selectDropdown('select-2-0', 'select-dropdown-2-0', 'Section_1.Page_1.Date_or_time');
    await selectDropdown('condition-2-0', 'condition-dropdown-2-0', 'date is “X” date of set date');
    const element = await driver.wait(until.elementLocated(By.css('[data-testid="set-date-2-0-calendar"]')), 5000);
    await element.click()
    await driver.wait(until.elementLocated(By.css('[data-testid="ArrowRightIcon"]')), 5000);
    const element2 = await driver.wait(until.elementLocated(By.css('[aria-colindex="4"]')), 5000);
    await element2.click()    
    // await driver.wait(until.elementLocated(By.css('[data-testid=""]')), 5000).click();  // Add AND condition
    await enterValue('value-input-2-0', '10');
});