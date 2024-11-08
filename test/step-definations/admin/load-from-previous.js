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
    try {
        for (let i = 0; i < 3; i++) {
            console.log(`test-${i}`);

            // Wait until the select attribute element is located and visible
            let selectAttribute = await driver.wait(until.elementLocated(By.css(`[data-testid="select-attribute"]`)), 5000);
            await driver.wait(until.elementIsVisible(selectAttribute), 5000);
            await driver.wait(until.elementIsEnabled(selectAttribute), 5000);
            await selectAttribute.click();

            console.log(`test-1-${i}`);

            // Wait until the specific attribute element is located and visible
            let attribute = await driver.wait(until.elementLocated(By.css(`[data-testid="attribute-${i}"]`)), 5000);
            await driver.wait(until.elementIsVisible(attribute), 5000);
            await driver.wait(until.elementIsEnabled(attribute), 5000);
            await attribute.click();
        }
    } catch (error) {
        console.error(`Error occurred while selecting the attribute type: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
    }
});

When('I click the service record', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="service-record"]`))).click();
});

When('I select the service record list', async function () {
    try {
        for (let i = 0; i < 3; i++) {
            console.log(`Starting interaction for service record ${i}`);

            // Wait for the service record dropdown to be located and visible
            let selectServiceRecord = await driver.wait(until.elementLocated(By.css(`[data-testid="select-service-record"]`)), 5000);
            await driver.wait(until.elementIsVisible(selectServiceRecord), 5000);
            await driver.wait(until.elementIsEnabled(selectServiceRecord), 5000);
            await selectServiceRecord.click();

            console.log(`Clicked select-service-record for service record ${i}`);

            // Wait for the specific service record to be located and visible
            let serviceRecord = await driver.wait(until.elementLocated(By.css(`[data-testid="service-record-${i}"]`)), 5000);
            await driver.wait(until.elementIsVisible(serviceRecord), 5000);
            await driver.wait(until.elementIsEnabled(serviceRecord), 5000);
            await serviceRecord.click();

            console.log(`Clicked service-record-${i}`);
        }
    } catch (error) {
        console.error(`Error occurred while selecting the service record list: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
    }
});