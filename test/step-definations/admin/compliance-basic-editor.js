const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const path = require('path');
const { elementLocated } = require('selenium-webdriver/lib/until');
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I add more then ten or conditions', async function () {
    await new Promise((resolve) => setTimeout(resolve, 250));
    for (let i = 0; i < 11; i++){
        await new Promise((resolve) => setTimeout(resolve, 200));
        await driver.wait(elementLocated(By.css('[data-testid="OR"]'))).click();
    }
});

When('I add more then ten add conditions', async function () {
    await new Promise((resolve) => setTimeout(resolve, 250));
    for (let i = 0; i < 11; i++){
        await new Promise((resolve) => setTimeout(resolve, 250));
        await driver.wait(elementLocated(By.css('[data-testid="AND-0"]'))).click();
    }
});

When('I add more then ten else if conditions', async function () {
    await new Promise((resolve) => setTimeout(resolve, 250));
    for (let i = 0; i < 11; i++){
        await new Promise((resolve) => setTimeout(resolve, 250));
        await driver.wait(elementLocated(By.css('[data-testid="else-if"]'))).click();
    }
});

When('I remove the added else if the conditions', async function() {
    for (let i = 10; i >= 0; i--){
        await new Promise((resolve) => setTimeout(resolve, 250));
        await driver.wait(elementLocated(By.css(`[data-testid="delete-elseif-0-${i}"]`))).click();
    }
});

When('I remove the added and the conditions', async function () {
    for (let i = 11; i >= 1; i--){
        await new Promise((resolve) => setTimeout(resolve, 250));
        await driver.wait(elementLocated(By.css(`[data-testid="delete-${i}"]`))).click();
    }
});

When('I remove the added or the conditions', async function () {
    for (let i = 11; i >= 1; i--){
        await new Promise((resolve) => setTimeout(resolve, 250));
        await driver.wait(elementLocated(By.css(`[data-testid="delete-${i}"]`))).click();
    }
});