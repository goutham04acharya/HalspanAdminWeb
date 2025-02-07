const assert = 'assert';
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const keys = webdriver.Key

// Given('I am on the dashboard screen', async function(){
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     await driver.wait(until.elementLocated(By.xpath('//*[text()="questionnaries"]')));  
// });

When('I click the log out button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Logout"]'))).click();
});

Then('I should see a confirmation prompt stating to logout', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Logout"]')));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="You will be signed out of your account."]')));
});


When('I click the close button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="cancel"]'))).click();
});

When('I click the modal close button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="modal-close"]'))).click();
});

When('I click the cancel button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="cancel"]'))).click()
    
});

When('I click the modal cancel button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="cancel-btn-modal"]'))).click()
});

When('I click on cancel button', async function(){
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="cancel-btn"]'))).click();
})

Then('I should be on the dashboard screen', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Questionnaries"]')));
});

When('I click the confirm button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="confirm"]'))).click();
});

Then('I should be redirected to the login screen', async function () {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Welcome"]')));
});
