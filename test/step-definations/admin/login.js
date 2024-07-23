const assert = 'assert';
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const keys = webdriver.Key

Given('I am on the login page', async function () {
    await driver.get('http://localhost:3000');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Log in"]')));
});

When('I enter valid email address as {string}', async function (string) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.id('username'))).sendKeys(string);
});

When('I enter valid password as {string}', async function (string) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.id('password'))).sendKeys(string);
});

When('I click the submit button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('button[type="submit"]'))).click();
});

Then('I should be redirected to the questionnaire listing screen', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.sleep(5000);
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Questionnaires"]')));   
});

When('I enter email address as {string}', async function(string){
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.id('username'))).sendKeys(string); 
});

When('I enter password as {string}', async function(string){
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.id('password'))).sendKeys(string);
});

Then('I should read a message stating that {string}', { timeout: 35000 }, async function (message) {
    await new Promise(resolve => setTimeout(resolve, 300));
    let check = false;
    let retries = 400;

    while (retries > 0) {
        const pageSource = await driver.getPageSource();
        check = pageSource.includes(message);

        if (check) {
            return 'passed';
        } else {
            await new Promise(resolve => setTimeout(resolve, 300));
            retries--;
        }
    }
    throw new Error('Failed');
});