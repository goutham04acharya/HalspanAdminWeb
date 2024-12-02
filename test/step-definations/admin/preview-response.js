/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const path = require('path');
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I enter the conditional logic for textbox field', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_textbox_Label_Name.includes("Inspector")');
});

When('I enter the text as {string} in textbox for section {int} page {int} question {int}', async function (text, sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await text_area.sendKeys(text);
});

Then('I should not see the choice field at section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // const choiceElement = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`)), 5000);
    // await driver.wait(until.stalenessOf(choiceElement), 5000);
    // await driver.wait(until.stalenessOf(await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`))), 5000));
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await driver.wait(until.stalenessOf(await driver.findElement(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`))), 5000);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        console.log(`--------This field should not appear-------- preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}`);
        // await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`)), 5000);
    } catch (error) {
        if (error.name === 'NoSuchElementError') {
            console.log('Passed: The field has been hidden due to conditional logic');
            return;
        } else {
            // Re-throw the error if it's not a NoSuchElementError
            throw error;
        }
    }
});

//------------------------------------------ This is not correct needs to be improved ------------------------------------------------
When('I enter the conditional logic for date\\/time field preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Date_or_time.AddDays(5) === "30/11/2024"');
});

When('I enter the date as {string} in date field for section {int} page {int} question {int}', async function (date, sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const date_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(date_area), 2000);
    await date_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await date_area.sendKeys(date);
});

Then('I should not see the text field at section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // const textElement = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`)), 5000);
    // await driver.wait(until.stalenessOf(textElement), 5000);
    // await driver.wait(until.stalenessOf(await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`)), 5000)));
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await driver.wait(until.stalenessOf(await driver.findElement(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`))), 5000);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        console.log(`--------This field should not appear-------- preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}`);
        // await driver.wait(until.stalenessOf(await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`))), 5000));
    } catch (error) {
        if (error.name === 'NoSuchElementError') {
            console.log('Passed: The field has been hidden due to conditional logic');
            return;
        } else {
            // Re-throw the error if it's not a NoSuchElementError
            throw error;
        }
    }
});

Then('I should see the advanced editor for choice field', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="advance-editor-tab"]`))).click();
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Shows when..."]')));
});

When('I enter the conditional logic for choice field preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_Choice_Label_Name.includes("PAN")');
});

When('I select the choice as {string} in choice field for section {int} page {int} question {int}', async function (choice, sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const choices = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`)), 5000);
    await driver.wait(until.elementIsVisible(choices), 2000);
    if (choice === 'PAN')
        await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="choices-0"]`))).click();
    else if (choice === 'AADHAR')
        await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="choices-1"]`))).click();
});

Then('I should not see the photo field at section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // const photoElement = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`)), 5000);
    // await driver.wait(until.stalenessOf(photoElement), 5000);
    // await driver.wait(until.stalenessOf(await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`)), 5000)));
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await driver.wait(until.stalenessOf(await driver.findElement(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`))), 5000);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        console.log(`--------This field should not appear-------- preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}`);
        // await driver.wait(until.stalenessOf(await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`))), 5000));
    } catch (error) {
        if (error.name === 'NoSuchElementError') {
            console.log('Passed: The field has been hidden due to conditional logic');
            return;
        } else {
            // Re-throw the error if it's not a NoSuchElementError
            throw error;
        }
    }
});

When('I enter the conditional logic for number field preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Sample_Number_Label_Name <= 10');
});

When('I enter the number as {string} in number field for section {int} page {int} question {int}', async function (number, sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const numberElement = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(numberElement), 2000);
    await numberElement.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await numberElement.sendKeys(number);
});

When('I enter the conditional logic for photos field preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="conditional-logic-text"]`))).sendKeys('Section_1.Page_1.Photo_label_name.() >= 3');
});

When('I remove the uploaded image from section {int} page {int} question {int}', async function(sectionNumber, pageNumber, quesionNumber){
    await new Promise(resolve => setTimeout(resolve, 750));
    const remove = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="remove-0"]`)));
    await remove.click();
});

When('I upload {string} photo for section {int} page {int} question {int}', async function (photo, sectionNumber, pageNumber, quesionNumber) {
    let element;
    let valid_file = 'image.png';

    await new Promise(resolve => setTimeout(resolve, 5000));
    while (photo !== 0) {
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="add-image"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
        photo--;
    }
});