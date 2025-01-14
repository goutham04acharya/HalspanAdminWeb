/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const path = require('path');
const Key = webdriver.Key

When('I upload file for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    let element;
    let valid_file = 'test.pdf';

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="add-file"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

When('I remove an uploaded file', async function () {
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="remove-file-0"]`))).click();
});

When('I upload video for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    let element;
    let valid_file = '1.mp4';

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="add-video"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

When('I remove an uploaded video', async function () {
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="remove-video-0"]`))).click();
});

When('I upload file exeeding limit for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    let element;
    let valid_file = 'Sample1.pdf';

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="add-file"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

When('I enter the minimum number of files', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="minChar"]'))).sendKeys('2');
});

When('I enter the minimum number of videos', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="minChar"]'))).sendKeys('2');
});

When('I upload video exeeding limit for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    let element;
    let valid_file = 'sample1.mp4';

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="add-video"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});