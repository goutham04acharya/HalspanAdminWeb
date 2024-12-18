const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key
const { faker } = require('@faker-js/faker');
const path = require('path');

When('I click the lookup dataset button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="lookup-dataset"]'))).click();
});

Then('I should be redirected to the lookup dataset listing screen', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Lookup Dataset"]')));
});

Given('I am on the lookup dataset listing screen', async function () {
    await driver.get('http://localhost:3000/lookup-dataset');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Lookup Dataset"]')));
});

Then('I should see the table header containing {string}', async function (tableHeader) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const arr = JSON.parse(tableHeader);
    const tableData = await driver.wait(until.elementLocated(By.xpath('//table/thead'))).getText();
    arr.forEach(element => {
        return assert(tableData.includes(element));
    });
});

When('I click the create lookup dataset button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="create-lookup-dataset"]'))).click();
});

Then('I should see a popup window to create lookup dataset', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Create Lookup Dataset"]')));
});

When('I enter the name of the lookup dataset', async function () {
    const name = `lookup${faker.string.alphanumeric(5)}`;
    await driver.wait(until.elementLocated(By.css('[data-testid = "name"]'))).sendKeys(name);
});

Given('I enter the choices in csv format', async function () {
    const csvData = Array.from({ length: 10 }, () => faker.company.name()).join(', ');
    await driver.wait(until.elementLocated(By.css('[data-testid="choices"]'))).sendKeys(csvData);
});

When('I upload the valid file csv as {string}', async function (valid_file) {
    let element;
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css('[data-testid="import-file"]')));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

Given('I click the create button', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="create"]'))).click();
});

When('I search by the name {string}', async function (string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const searchName = await driver.wait(until.elementLocated(By.css('[data-testid = "searchBox"]')));
    await searchName.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    await searchName.sendKeys(string);
});

When('I search by the name', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let nameElement = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[4]/td[2]`)), 10000);
    this.name = await nameElement.getText();
    console.log(this.name, "1234");
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    await searchBox.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    await searchBox.sendKeys(this.name);
    await new Promise(resolve => setTimeout(resolve, 3000));
});

Then('The results should display lookup dataset matching the name', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let tbody = await driver.wait(until.elementLocated(By.css(`tbody`)))
    await driver.wait(until.elementIsVisible(tbody))

    datasetName = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`))).getText();
    console.log(datasetName, "2345")
    assert.equal(this.name, datasetName);
});

Then('I should read success message for updating dataset by importing the dataset', { timeout: 35000 }, async function () {
    let check = false;
    let retries = 400;

    while (retries > 0) {
        const pageSource = await driver.getPageSource();
        console.log(this.id, 'the id');
        check = pageSource.includes(`Updated lookup dataset ID ${this.id} successfully`);

        if (check) {
            return 'passed';
        } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries--;
        }
    }
    throw new Error('Failed');
});

When('I click on the view dataset', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await driver.wait(until.elementLocated(By.id(`view0`))).click();
    const id = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[1]`))).getText();
    this.id = id;
});

Then('I should see a popup window to view lookup dataset', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="View Lookup Dataset"]')));
});

When('I click the import button', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="import-btn"]'))).click();
});

Then('I should see a confirmation model to replacing existing dataset', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Replace Lookup Dataset"]')));
});

When('I click the delete option for a searched lookup dataset', async function () {
    await new Promise(resolve => setTimeout(resolve, 1500));
    tbody = await driver.wait(until.elementLocated(By.css(`tbody`)));
    await driver.wait(until.elementIsVisible(tbody))

    const id = await driver.wait(until.elementLocated(By.css(`tbody tr:nth-child(1) td:nth-child(1)`))).getText();
    console.log(id, 'pppooo')
    this.id = id
    await driver.wait(until.elementLocated(By.css(`[data-testid="delete-${this.id}"]`))).click();
});

When('I search recently created lookup dataset by bddtest', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const searchName = await driver.wait(until.elementLocated(By.css('[data-testid = "searchBox"]')));
    await searchName.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    await searchName.sendKeys(global.lookupName);
});


When('I click on close button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="cancel"]'))).click();
});

When('I edit the lookup data set name', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const name = await driver.wait(until.elementLocated(By.css('[data-testid="name"]')));
    await name.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    const lookupName = `lookup${faker.string.alphanumeric(5)}`;
    console.log(lookupName);
    await name.sendKeys(lookupName);
});

When('I edit the values in lookup dataset', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const value = await driver.wait(until.elementLocated(By.css('[data-testid="value-0"]')));
    await value.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    await value.sendKeys('Someshwara');
});

When('I delete the values in lookup dataset', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const value = await driver.wait(until.elementLocated(By.css('[data-testid="delete-choice-1"]'))).click();
});

When('I add the values to lookup dataset', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="add-choice-2"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid="additional-value-0"]'))).sendKeys('India, Sri lanka');
});

When('I click on update button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="create"]'))).click();
});

Then('I should read a message stating that the lookup dataset has been updated', async function () {
    let check = false;
    let retries = 400;

    console.log(`Updated lookup dataset ID ${this.id} successfully.`)
    while (retries > 0) {
        const pageSource = await driver.getPageSource();
        console.log(this.id, 'the id');
        check = pageSource.includes(`Updated lookup dataset ID ${this.id} successfully.`);
        console.log(check);
        if (check) {
            return 'passed';
        } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries--;
        }
    }
    throw new Error('Failed');
});