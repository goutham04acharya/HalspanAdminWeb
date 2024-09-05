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
    headingInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.heading = 'Display content as field';
    await headingInput.sendKeys(this.heading);
});

Then('I should be able see heading updated in question {int} page {int} section {int}', async function (sectionNumber, pageNumber, questionNumber) {
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

When('I upload the image from disk', async function () {
    let element;
    let valid_file = 'image.png';
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css('[data-testid="add-image"]')));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

Then('I should be able see image updated in question {int} page {int} section {int}', async function (sectionNumber, pageNumber, questionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const text = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${questionNumber}"] [data-testid="image"]`)));
    await driver.wait(until.elementIsVisible(text), 2000);
});

When('I click the type as url', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="url"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="url-dropdown"]`))).click();
});

When('I click the url type as {string}', async function (urlType) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="${urlType}"]`)));
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
    assert.equal(urlText, this.url);
});