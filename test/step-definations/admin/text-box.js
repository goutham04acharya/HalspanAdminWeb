/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber');
const { until, By, Key } = require('selenium-webdriver')

Then('I should see an add field section', async function () {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Add Field"]')));
});

When('I click the textbox button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const textboxButton = await driver.wait(until.elementLocated(By.css('[data-testid="textbox"]')));
    await textboxButton.click();
});

Then('I should see field settings', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="field-settings"]')));
});

Then('I should see the text box added to the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"]`)));
});

When('I enter the label name for textbox', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    await labelNameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)
    await labelNameInput.sendKeys('Sample Label Name');
    this.labelName = 'Sample Label Name'
});

Then('I should see the label name updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="label-name"]`)));
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, this.labelName);
});

When('I enter the help text for textbox', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    await helpTextInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)

    await helpTextInput.sendKeys('Sample Help Text');
    this.helpText = 'Sample Help Text'
});

Then('I should see the help text updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.helpText);
});

When('I enter the placeholder content for textbox', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    await placeholderInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)

    await placeholderInput.sendKeys('Sample Placeholder');
    this.placeholder = 'Sample Placeholder'
});

Then('I should see the placeholder content updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, this.placeholder);
});

When('I select the type as {string}', async function (type) {
    await new Promise(resolve => setTimeout(resolve, 750));
    console.log(`selecting type == [data-testid="${type}"]`)
    await driver.wait(until.elementLocated(By.css(`[data-testid="${type}"]`))).click();
});

When('I select the format as {string}', async function (format) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="format-dropdown"]`))).click();
    switch (format) {
    case "alpha":
        await driver.wait(until.elementLocated(By.css(`[data-testid="format-list-0"]`))).click();
        break;
    case "numeric":
        await driver.wait(until.elementLocated(By.css(`[data-testid="format-list-2"]`))).click();
        break;
    case "alphanumeric":
        await driver.wait(until.elementLocated(By.css(`[data-testid="format-list-1"]`))).click();
        break;
    case "custom-regular-expression":
        await driver.wait(until.elementLocated(By.css(`[data-testid="format-list-3"]`))).click();
        break;
    default:
        await driver.wait(until.elementLocated(By.css(`[data-testid="format-list-1"]`))).click();
        break;
    }
    
    this.format = format;
});

Then('I should see the format reflected on the text box section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const textBox = await driver.wait(until.elementLocated(By.css(`[data-testid="textbox-${sectionNumber}"]`)));
    await textBox.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));

    if (this.format === 'alpha') {
        await textBox.sendKeys(`alpha12121212`);
        const text = await textBox.getText();
        assert(/^[a-zA-Z]+$/.test(text), 'Textbox contains non-alphabetic characters');
    }
    else if (this.format === 'numeric') {
        await textBox.sendKeys(`1234alpha`);
        const text = await textBox.getText();
        assert(/^\d+$/.test(text), 'Textbox contains non-numeric characters');
    }
    else if (this.format === 'alphanumeric') {
        await textBox.sendKeys(`alpha1234@@##`);
        const text = await textBox.getText();
        assert(/^[a-zA-Z0-9]+$/.test(text), 'Textbox contains non-alphanumeric characters');
    }
});

When('I enter the minimum and maximum number of characters', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="minChar"]'))).sendKeys('10');
    await driver.wait(until.elementLocated(By.css('[data-testid="maxChar"]'))).sendKeys('500');
});

When('I enter the admin field notes', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="Notes"]'))).sendKeys('Sample Admin Notes');
});

When('I select a lookup data from the dropdown', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="lookup-dropdown"]'))).click();
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css('[data-testid="lookup-list-0"]'))).click();
});

When('I click on save button for field settings', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.stalenessOf(driver.findElement(By.css(`[data-testid="save-field-settings"]`)))).click();
});