/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Actions = require('selenium-webdriver').Actions
const Keys = webdriver.Key


When('I click on edit option', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="edit"]`))).click();
});

Then('I should see a pop up for selecting the version of the questionnaire', async function () {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Edit Questionnaire"]')));
});

When('I select the version', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="Version"]'))).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="Version-1"]'))).click();
});

When('I click the confirm edit button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="confirm-edit"]`))).click();
});

Then('I should be redirected to the questionnaire management section of that version', async function () {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // await driver.wait(until.elementLocated(By.xpath('//p[text()="Version 1"]')));
    console.log(global.internalNameVersion);
    await driver.wait(until.elementLocated(By.xpath(`//p[text()="Minerva Levy 1"]`)));
});

// Given('I am on the questionnaire version listing screens', async function () {
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     await driver.wait(until.elementLocated(By.xpath(`//p[text()="${global.internalNameVersion}"]`)));
// });

When('I click the outside modal', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const actions = driver.actions({ async: true });

    // Specify the x and y coordinates
    const x = 100; // Replace with your desired x-coordinate
    const y = 300; // Replace with your desired y-coordinate

    // Perform a click at the specified coordinates
    await actions.move({ x, y }).click().perform();
});
