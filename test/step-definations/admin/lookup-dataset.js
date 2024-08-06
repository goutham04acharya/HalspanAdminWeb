const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

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

Then('I should see the table header containing {string}', async function (string) {
    arr = JSON.parse(table_Header)
    tableData = await driver.wait(until.elementLocated(By.css(`[data-testid="dataset-table"]`))).getText()
    console.log('table data', tableData)
    arr.forEach(element => {
        assert(tableData.includes(element))
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

When('I click the import button', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="import"]'))).click();
});

Given('I click the create button', async function () {
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="create"]'))).click();
});

When('I search by the name {string}', async function (string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid = "seacrh-box"]'))).sendKeys(string);
});

When('I search by the name', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let nameElement = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[3]/td[2]`)), 10000);
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
    console.log(internalName,"2345")
    assert.equal(this.name, datasetName);
});
