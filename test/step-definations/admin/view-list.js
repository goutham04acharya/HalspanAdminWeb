/* eslint-disable max-len */
const assert = 'assert';
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Given('no questionnaires exist', async function () {
    const isTablePresent = await driver.executeScript("return document.querySelector('table') !== null");
    assert.strictEqual(isTablePresent, false, 'Expected no questionnaires table to be present');
});

When('I enter internal name as {string} in the search box', async function (internalName) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "searchBox"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE), internalName);
});

When('I enter public name as {string} in the search box', async function (publicName) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "searchBox"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE), publicName);
});

When('I enter description as {string} in the search box', async function (description) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "searchBox"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE), description);
});

When('I select asset type as window from the filter dropdown', async function (assetType) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "drop-btn"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid = "option2"]'))).click();
});

// Updated code based on chronological order
Then('I should see a paginated list of questionnaires sorted by recently created', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let items = await driver.wait(until.elementsLocated(By.css('tbody > tr > td:nth-child(1)')));
    let item_texts = await Promise.all(items.map(item => item.getText()));
    let sorted_item_texts = [...item_texts].sort((a, b) => b - a);
    assert.deepStrictEqual(item_texts, sorted_item_texts, 'Questionnaires are not sorted by recently created');
});

When('I enter a internal name in the search box', async function () {
    const name = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`)));
    const internalName = await name.getText();
    this.internalName = internalName;
    await driver.wait(until.elementLocated(By.css('[data-testid = "searchBox"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE), this.internalName);
});

Then('the results should display questionnaires matching the internal name', async function () {
    const internalName = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`))).getText();
    assert.strictEqual(internalName, this.internalName, 'The searched internal name does not match the expected internal name.');
});

When('I enter a public name in the search box', async function () {
    const publicName = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`))).getText();
    this.publicName = publicName;
    await driver.wait(until.elementLocated(By.css('[data-testid = "searchBox"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE), this.publicName);
});

Then('the results should display questionnaires matching the public name', async function () {
    const publicName = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`))).getText();
    assert.strictEqual(publicName, this.publicName, 'The searched public name does not match the expected public name.');
});

When('I enter description in the search box', async function () {
    const description = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[6]`))).getText();
    this.description = description;
    await driver.wait(until.elementLocated(By.css('[data-testid = "searchBox"]'))).sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE), this.description);
});

Then('the results should display questionnaires matching the description', async function () {
    const description = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[6]`))).getText();
    assert.strictEqual(description, this.description, 'The searched description does not match the expected description.');
});

When('I select an asset type from the filter dropdown', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "drop-btn"]'))).click();
    await driver.wait(until.elementLocated(By.css('[data-testid = "option1"]'))).click();
});

Then('the results should be refined to show questionnaires of the selected asset type', async function () {
    let items = await driver.wait(until.elementsLocated(By.css('tbody > tr > td:nth-child(5)'))); 
    let item_texts = await Promise.all(items.map(item => item.getText()));
    assert(item_texts.length > 0, 'No questionnaires match the selected asset type');
    item_texts.map((data) => {
        assert.equal('Door', data);
    });
});

Then('the results should display questionnaires matching the entered internal name and asset type', async function () {
    let items = await driver.wait(until.elementsLocated(By.css('tbody > tr')));
    let item_texts = await Promise.all(items.map(async item => {
        let name = await item.findElement(By.css('td:nth-child(2)')).getText();
        let type = await item.findElement(By.css('td:nth-child(5)')).getText();
        return { name, type };
    }));
    assert(item_texts.length > 0, 'No questionnaires match your search and filter criteria');

    // Verify that all displayed items match the entered internal name and the asset type 'door'
    item_texts.forEach((data) => {
        assert.equal(data.name, this.internalName, `Expected internal name: ${this.internalName}, but found: ${data.name}`);
        assert.equal(data.type, 'Door', `Expected asset type: 'door', but found: ${data.type}`);
    });
});

Then('the results should display questionnaires matching the entered public name and asset type', async function () {
    let items = await driver.wait(until.elementsLocated(By.css('tbody > tr')));
    let item_texts = await Promise.all(items.map(async item => {
        let name = await item.findElement(By.css('td:nth-child(3)')).getText();
        let type = await item.findElement(By.css('td:nth-child(5)')).getText();
        return { name, type };
    }));
    assert(item_texts.length > 0, 'No questionnaires match your search and filter criteria');

    // Verify that all displayed items match the entered internal name and the asset type 'door'
    item_texts.forEach((data) => {
        assert.equal(data.name, this.publicName, `Expected public name: ${this.publicName}, but found: ${data.name}`);
        assert.equal(data.type, 'Door', `Expected asset type: 'door', but found: ${data.type}`);
    });
});

Then('the results should display questionnaires matching the entered description and asset type', async function () {
    let items = await driver.wait(until.elementsLocated(By.css('tbody > tr')));
    let item_texts = await Promise.all(items.map(async item => {
        let name = await item.findElement(By.css('td:nth-child(6)')).getText();
        let type = await item.findElement(By.css('td:nth-child(5)')).getText();
        return { name, type };
    }));
    assert(item_texts.length > 0, 'No questionnaires match your search and filter criteria');

    // Verify that all displayed items match the entered internal name and the asset type 'door'
    item_texts.forEach((data) => {
        assert.equal(data.name, this.description, `Expected description: ${this.description}, but found: ${data.name}`);
        assert.equal(data.type, 'Door', `Expected asset type: 'door', but found: ${data.type}`);
    });
});