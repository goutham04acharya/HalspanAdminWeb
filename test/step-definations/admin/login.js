const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
const assert = require('assert');


Given('I am on the login page', async function () {
    await driver.get('localhost:3000');
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('button[type="submit"]')));
});


When('I enter a valid email address and password', async function () {
    const emailInput = await driver.wait(until.elementLocated(By.id('username')));
    await emailInput.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.DELETE);
    await emailInput.sendKeys('nayana.sk@7edge.com');
    await new Promise(resolve => setTimeout(resolve, 750));

    const passwordInput = await driver.wait(until.elementLocated(By.id('password')));
    await passwordInput.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.DELETE);
    await passwordInput.sendKeys('Auth@123');
    await new Promise(resolve => setTimeout(resolve, 750));
});


When('I click the submit button', async function () {
    await driver.wait(until.elementLocated(By.css('button[type="submit"]'))).click();
});


Then('I should be redirected to the questionnaire listing screen', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    
});

