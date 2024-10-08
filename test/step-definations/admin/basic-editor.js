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

let bool = true;

// When('I enter the correct conditional logic for basic editor', async function () {
//     await new Promise((resolve) => setTimeout(resolve, 750));  // Adding delay

//     let i = 0;  // Ensure 'i' is properly declared
//     while (bool) {
//         let select = await driver.wait(until.elementLocated(By.css(`[data-testid="select-${i}"]`)), 10000); 

//         let selectText = await select.getText();  // Await for getText() method
//         if (selectText === Section_1.Page_1.Question_1) {
//             await select.click();  // Ensure click is awaited
//             bool = false;  // Exit loop after finding the correct element
//         }
//         i++;  // Increment index to check the next element
//     }

// });

When('I enter the correct conditional logic for basic editor', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));  // Adding delay

    // First condition: Section1.Page1.Question1 - equals - 200
    let select1 = await driver.wait(until.elementLocated(By.css('[data-testid="select-0"]')), 10000);
    await select1.click();
    let selectOption1 = await driver.wait(until.elementLocated(By.xpath('//*[text()="Section1.Page1.Question1"]')), 10000);
    await selectOption1.click();

    let condition1 = await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-0"]')), 10000);
    await condition1.click();
    let conditionOption1 = await driver.wait(until.elementLocated(By.xpath('//*[text()="equals"]')), 10000);
    await conditionOption1.click();

    let valueField1 = await driver.wait(until.elementLocated(By.css('[data-testid="value-input-0"]')), 10000);
    await valueField1.sendKeys("200");

    // Add 'OR' between conditions
    let orOption1 = await driver.wait(until.elementLocated(By.xpath('//*[text()="OR"]')), 10000);
    await orOption1.click();

    // Second condition: Section1.Page2.Question1 - not equal to - Good Morning
    let select2 = await driver.wait(until.elementLocated(By.css('[data-testid="select-1"]')), 10000);
    await select2.click();
    let selectOption2 = await driver.wait(until.elementLocated(By.xpath('//*[text()="Section1.Page2.Question1"]')), 10000);
    await selectOption2.click();

    let condition2 = await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-1"]')), 10000);
    await condition2.click();
    let conditionOption2 = await driver.wait(until.elementLocated(By.xpath('//*[text()="not equal to"]')), 10000);
    await conditionOption2.click();

    let valueField2 = await driver.wait(until.elementLocated(By.css('[data-testid="value-input-1"]')), 10000);
    await valueField2.sendKeys("Good Morning");

    // Add 'OR' between conditions
    let orOption2 = await driver.wait(until.elementLocated(By.xpath('//*[text()="OR"]')), 10000);
    await orOption2.click();

    // Third condition: Section1.Page1.Question2 - includes - Hii
    let select3 = await driver.wait(until.elementLocated(By.css('[data-testid="select-2"]')), 10000);
    await select3.click();
    let selectOption3 = await driver.wait(until.elementLocated(By.xpath('//*[text()="Section1.Page1.Question2"]')), 10000);
    await selectOption3.click();

    let condition3 = await driver.wait(until.elementLocated(By.css('[data-testid="condition-dropdown-2"]')), 10000);
    await condition3.click();
    let conditionOption3 = await driver.wait(until.elementLocated(By.xpath('//*[text()="includes"]')), 10000);
    await conditionOption3.click();

    let valueField3 = await driver.wait(until.elementLocated(By.css('[data-testid="value-input-2"]')), 10000);
    await valueField3.sendKeys("Hii");

    // Click 'Save' to submit the form
    let saveButton = await driver.wait(until.elementLocated(By.css('[data-testid="save-button"]')), 10000);
    await saveButton.click();
});
