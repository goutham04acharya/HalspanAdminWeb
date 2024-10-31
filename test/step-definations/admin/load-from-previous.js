/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const path = require('path');
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I check the options {string}', async function (option) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="${option}"]`))).click();
});

When('I select the attribute data', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="attribute-data"]`))).click();
});

When('I select the attribute type', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    let i=0;
    while (i < 3){
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css(`[data-testid="select-attribute"]`))).click();
        await driver.wait(until.elementLocated(By.css(`[data-testid="attribute-${i}"]`))).click();
        i++;
    }
});

When('I click the service record', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="service-record"]`))).click();
});

When('I select the service record list', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    let i=0;
    while (i < 3){
        await new Promise(resolve => setTimeout(resolve, 250));
        await driver.wait(until.elementLocated(By.css(`[data-testid="select-service-record"]`))).click();
        await driver.wait(until.elementLocated(By.css(`[data-testid="service-record-${i}"]`))).click();
        i++;
    }
});