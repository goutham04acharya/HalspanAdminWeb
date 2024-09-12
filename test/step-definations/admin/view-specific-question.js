/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Given('I am on the questionnaire version listing screen', async function () {
    const questionnaireId = global.response?.data?.data?.questionnaire_id;
    console.log('questionnaire ID:', questionnaireId);
    console.log('questionPublicName:', global.questionPublicName);

    if (questionnaireId && global.questionPublicName) {
        await driver.get(`http://localhost:3000/questionnaries/version-list/${global.questionPublicName}/${questionnaireId}`); // Replace with actual URL
        await new Promise((resolve) => setTimeout(resolve, 500));
        const pageSource = await driver.getPageSource();
        check = pageSource.includes('Minerva Levy');
    } else {
        throw new Error('Questionnaire ID or version number is missing.');
    }
});

When('I click the save settings button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="save-settings"]`))).click();
});