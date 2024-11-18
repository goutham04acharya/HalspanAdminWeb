const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I select asset type as {string} from the filter dropdown', async function (asset) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "drop-btn"]'))).click();

    switch (asset) {
    case 'Fire door':
        await driver.wait(until.elementLocated(By.css('[data-testid = "option1"]'))).click();
        this.asset= await driver.wait(until.elementLocated(By.css('[data-testid = "option1"]'))).getText();
        break;
    case 'Fire extinguisher':
        await driver.wait(until.elementLocated(By.css('[data-testid = "option2"]'))).click();
        this.asset= await driver.wait(until.elementLocated(By.css('[data-testid = "option2"]'))).getText();
        break;
    case 'Updated Elevator':
        await driver.wait(until.elementLocated(By.css('[data-testid = "option3"]'))).click();
        this.asset= await driver.wait(until.elementLocated(By.css('[data-testid = "option3"]'))).getText();
        break;
    case 'test create nav':
        await driver.wait(until.elementLocated(By.css('[data-testid = "option4"]'))).click();
        this.asset= await driver.wait(until.elementLocated(By.css('[data-testid = "option4"]'))).getText();
        break;
    case 'create access':
        await driver.wait(until.elementLocated(By.css('[data-testid = "option5"]'))).click();
        this.asset= await driver.wait(until.elementLocated(By.css('[data-testid = "option2"]'))).getText();
        break;
    case 'Asset1':
        await driver.wait(until.elementLocated(By.css('[data-testid = "option6"]'))).click();
        this.asset= await driver.wait(until.elementLocated(By.css('[data-testid = "option3"]'))).getText();
        break;
    case 'Window':
        await driver.wait(until.elementLocated(By.css('[data-testid = "option7"]'))).click();
        this.asset= await driver.wait(until.elementLocated(By.css('[data-testid = "option4"]'))).getText();
        break;
    default:
        console.error(`Invalid asset type: ${asset}`);
    }
});  

When('I select the {string} from the asset type dropdown', async function (asset) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "drop-btn"]'))).click();

    switch (asset) {
    case 'Fire door':
        await driver.wait(until.elementLocated(By.css('[data-testid = "asset-0"]'))).click();
        break;
    case 'Fire extinguisher':
        await driver.wait(until.elementLocated(By.css('[data-testid = "asset-1"]'))).click();
        break;
    case 'Updated Elevator':
        await driver.wait(until.elementLocated(By.css('[data-testid = "asset-2"]'))).click();
        break;
    case 'test create nav':
        await driver.wait(until.elementLocated(By.css('[data-testid = "asset-3"]'))).click();
        break;
    case 'create access':
        await driver.wait(until.elementLocated(By.css('[data-testid = "asset-4"]'))).click();
        break;
    case 'Asset1':
        await driver.wait(until.elementLocated(By.css('[data-testid = "asset-5"]'))).click();
        break;
    case 'Window':
        await driver.wait(until.elementLocated(By.css('[data-testid = "asset-6"]'))).click();
        break;
    default:
        console.error(`Invalid asset type: ${asset}`);
    }
});

Then('The results should show questionnaries of the selected asset type', async function(){
    await new Promise(resolve => setTimeout(resolve, 3000));
    let tbody = await driver.wait(until.elementLocated(By.css(`tbody`)))
    await driver.wait(until.elementIsVisible(tbody));
    let i = 1;

    while (true) {
        try {
            const item = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[${i}]/td[5]`)),5000).getText();
            assert.equal(this.asset, item);
            i++;
        } catch (error) {
            console.log(`No more rows to check. Exiting at row ${i}.`);
            break;
        }
    }
});