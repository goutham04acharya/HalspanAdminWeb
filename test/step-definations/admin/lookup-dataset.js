const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key
const { faker } = require('@faker-js/faker');
const path = require('path');

When('I click the lookup dataset button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
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
    await driver.wait(until.elementLocated(By.css('[data-testid = "searchBox"]'))).sendKeys(string);
});

When('I search by the name', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let nameElement = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`)), 10000);
    this.name = await nameElement.getText();
    console.log(this.name, "1234");
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    await searchBox.sendKeys(this.name);
    await new Promise(resolve => setTimeout(resolve, 3000));
});

Then('The results should display lookup dataset matching the name', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let tbody = await driver.wait(until.elementLocated(By.css(`tbody`)))
    await driver.wait(until.elementIsVisible(tbody))

    datasetName = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`))).getText();
    console.log(datasetName,"2345")
    assert.equal(this.name, datasetName);
});
