/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

Given('I am in questionnaire listing screen', async function(){
    await driver.get('http://localhost:3000/questionnaries');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Questionnaries"]')));
});

When('I enter search term as {string}', async function(string){
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]'))).sendKeys(string);
});

When('I search by internal name', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let internalNameElement = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[3]/td[2]`)), 10000);
    this.internal_name = await internalNameElement.getText();
    console.log(this.internal_name, "1234");
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    await searchBox.sendKeys(this.internal_name);
    await new Promise(resolve => setTimeout(resolve, 3000));
});

Then('The results should display questionnaries matching the internal name', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let tbody = await driver.wait(until.elementLocated(By.css(`tbody`)))
    await driver.wait(until.elementIsVisible(tbody))

    internalName = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`))).getText();
    console.log(internalName,"2345")
    assert.equal(this.internal_name, internalName);
});

When('I search by public name', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let publicNameElement = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[3]`)), 10000);
    this.public_name = await publicNameElement.getText();
    console.log(this.public_name, "1234");
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    await searchBox.sendKeys(this.public_name);
    await new Promise(resolve => setTimeout(resolve, 3000));
});

Then('The results should display questionnaries matching the public name', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let tbody = await driver.wait(until.elementLocated(By.css(`tbody`)))
    await driver.wait(until.elementIsVisible(tbody))

    publicName = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[3]`))).getText();
    console.log(internalName,"2345")
    assert.equal(this.public_name, publicName);
});

When('I search by description', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let descriptionElement = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[3]/td[6]`)), 10000);
    this.description = await descriptionElement.getText();
    console.log(this.description, "1234");
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    await searchBox.sendKeys(this.description);
    await new Promise(resolve => setTimeout(resolve, 3000));
});

Then('The results should display questionnaries matching the description', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let tbody = await driver.wait(until.elementLocated(By.css(`tbody`)))
    await driver.wait(until.elementIsVisible(tbody))

    description = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[6]`))).getText();
    console.log(description,"2345")
    assert.equal(this.description, description);
});

When('I select asset type from the filter dropdown', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid = "drop-btn"]'))).click();
    this.asset= await driver.wait(until.elementLocated(By.css('[data-testid = "option1"]'))).getText();
    await driver.wait(until.elementLocated(By.css('[data-testid = "option1"]'))).click();

});

Then('The results should be refined to show questionnaries of the selected asset type', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let tbody = await driver.wait(until.elementLocated(By.css(`tbody`)))
    await driver.wait(until.elementIsVisible(tbody))
    item = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[5]`))).getText();
    assert.equal(this.asset, item);
});
   
When('I store the first internal name from list', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let internalNameElement = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]`)), 10000);
    this.internal_name = await internalNameElement.getText();
    console.log(this.internal_name, "1234");
});

When('I search by internal name with spaces', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    await searchBox.sendKeys("     ");
    await new Promise(resolve => setTimeout(resolve, 2000));
});

When('I clear the empty search', async function () {
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    await searchBox.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    await new Promise(resolve => setTimeout(resolve, 1000));
} );