/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require('selenium-webdriver');
const path = require('path');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key

When('I click the display button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="display"]`))).click();
});

Then('I should see the display field added to the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"]`)));
});

When('I click the type as headings', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="heading"]`))).click();
});

When('I enter the heading', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const headingInput = await driver.wait(until.elementLocated(By.css('[data-testid="heading-input"]')));
    headingInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    this.heading = 'Display content as field';
    await headingInput.sendKeys(this.heading);
});

Then('I should be able see heading updated in question {int} page {int} section {int}', async function (questionNumber, pageNumber, sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const heading = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"] [data-testid="heading"]`)));
    await driver.wait(until.elementIsVisible(heading), 2000);
    const headingText = await heading.getText();
    console.log(this.heading);
    assert.equal(headingText, this.heading);
});

When('I click the type as text', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="text"]`))).click();
});

When('I enter the text', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const textInput = await driver.wait(until.elementLocated(By.css('[data-testid="text-input"]')));
    textInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.text = 'Display content as field';
    await textInput.sendKeys(this.text);
});

Then('I should be able see text updated in question {int} page {int} section {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const text = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"] [data-testid="text"]`)));
    await driver.wait(until.elementIsVisible(text), 2000);
    const textText = await text.getText();
    console.log(this.text);
    assert.equal(textText, this.text);
});

When('I click the type as image', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="image"]`))).click();
});

let uploadCounter = 0; // Initialize counter

When('I upload the image from disk', async function () {
    let element;
    let valid_file = '';
    if (uploadCounter === 0) {
        valid_file = 'image.png';
    } else if (uploadCounter === 1) {
        valid_file = 'image1.png';
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css('[data-testid="add-image"]')));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
    uploadCounter++;
    if (uploadCounter > 1) {
        uploadCounter = 0;
    }
});


Then('I should be able see image updated in question {int} page {int} section {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const text = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"] [data-testid="uploaded-image"]`)));
    await driver.wait(until.elementIsVisible(text), 2000);
});

When('I click the type as url', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="url"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="url-dropdown"]`))).click();
});

When('I click the url type as {string}', async function (urlType) {
    await new Promise(resolve => setTimeout(resolve, 750));
    this.urlType = urlType;
    if (urlType === 'http') {
        await driver.wait(until.elementLocated(By.css('[data-testid="url-list-0"]'))).click();
    }
    else if (urlType === 'https') {
        await driver.wait(until.elementLocated(By.css('[data-testid="url-list-1"]'))).click();
    }
    else if (urlType === 'mailto') {
        await driver.wait(until.elementLocated(By.css('[data-testid="url-list-2"]'))).click();
    }
    else if (urlType === 'tel') {
        await driver.wait(until.elementLocated(By.css('[data-testid="url-list-3"]'))).click();
    }
});


Given('I enter the url as {string}', async function (urlText) {
    await new Promise(resolve => setTimeout(resolve, 750));
    this.url = urlText;
    await driver.wait(until.elementLocated(By.css(`[data-testid="urlInput"]`))).sendKeys(urlText);
});

Then('I should be able see url updated in question {int} page {int} section {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const url = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"] [data-testid="url"]`)));
    await driver.wait(until.elementIsVisible(url), 2000);
    const urlText = await url.getText();
    console.log(this.url);
    if (this.urlType === 'http') {
        assert.equal(urlText, 'http://' + this.url);
    } else if (this.urlType === 'https') {
        assert.equal(urlText, 'https://' + this.url);
    } else if (this.urlType === 'tel')
        assert.equal(urlText, 'tel: ' + this.url);
    else
        assert.equal(urlText, 'mailto: ' + this.url);
});

Then('I should see a confirmation prompt stating to replace image', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Replace Image"]')));
});

When('I click the add image', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await driver.wait(until.elementLocated(By.css('[data-testid="upload-image"]'))).click();
});