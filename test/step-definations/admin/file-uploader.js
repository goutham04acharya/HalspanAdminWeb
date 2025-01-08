const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I upload file for section {int} page {int} question {int}', async function (int, int2, int3) {
    let element;
    let valid_file = 'test.pdf';

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        // eslint-disable-next-line max-len
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="add-file"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

When('I remove an uploaded file', async function () {
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="remove-file-1"]`))).click();
});

When('I upload video for section {int} page {int} question {int}', async function (int, int2, int3) {
    let element;
    let valid_file = '1.mp4';

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        // eslint-disable-next-line max-len
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="add-video"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

When('I remove an uploaded video', async function () {
    await new Promise(resolve => setTimeout(resolve, 250));
    await driver.wait(until.elementLocated(By.css(`[data-testid="remove-video-1"]`))).click();
});