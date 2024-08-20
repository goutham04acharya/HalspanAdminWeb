/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber');
const { resolve } = require('path');
const webdriver = 'selenium-webdriver'
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click the choice button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="choice"]`))).click();
});

Then('I should see the choice field added to the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-choice"]`)));
});

When('I select the choice type as {string}', async function (choiceType) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const choice = await driver.wait(until.elementLocated(By.css(`[data-testid="${choiceType}"]`))).click();
    this.choiceType = choice;
});

Given('I add the {int}th choice field', async function (choiceNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-choice-${choiceNumber}"]`))).click();
});

Then('I should see the choice {int} added', async function (choiceNumber) {
    await new promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="choice-${choiceNumber}"]`)));
});

When('I delete the {int}th choice field', async function (choiceNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="delete-choice-${choiceNumber}"]`))).click();
});

Then('I should see the {int}th choice deleted', async function (choiceNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.stalenessOf(driver.findElement(By.css(`[data-testid="choice-${choiceNumber}"]`))));
});

When('I enter the text for choices as {string}', async function (choicesText) {
    const choices = choicesText.split(',').map(choice => choice.trim());
    for (let i = 0; i < choices.length; i++) {
        const choiceNumber = i + 1;
        const choiceElement = await driver.wait(until.elementLocated(By.css(`[data-testid="choice-${choiceNumber}"]`)));
        await choiceElement.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
        await choiceElement.sendKeys(choices[i]);
    }
    this.enteredChoices = choices;
});

Then('I should see the choices updated on the section {int}', async function (sectionNumber) {
    if (this.choiceType !== 'dropdown') {
        const sectionChoices = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-choices"]`)));
        
        for (let i = 0; i < this.enteredChoices.length; i++) {
            const choiceNumber = i + 1;
            // eslint-disable-next-line max-len
            const choiceElement = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1-choice-${choiceNumber}"]`))); 
            const choiceText = await choiceElement.getText();
            assert.equal(choiceText, this.enteredChoices[i]);
        }
    }    
});

When('I click on the choices based on {string}', async function (choiceType) {
    await new Promise(resolve => setTimeout(resolve, 750));

    if (choiceType === 'single_choice') {
        const choiceElement = await driver.wait(until.elementLocated(By.css('[data-testid="choice-1"]')));
        await choiceElement.click();
    } else if (choiceType === 'multi_choice') {
        for (let choiceNumber = 1; choiceNumber <= 3; choiceNumber++) {
            const choiceElement = await driver.wait(until.elementLocated(By.css(`[data-testid="choice-${choiceNumber}"]`)));
            await choiceElement.click();
        }
    } else if (choiceType === 'dropdown') {
        if (this.choiceType === 'dropdown') {
            const dropdownChoiceElement = await driver.wait(until.elementLocated(By.css('[data-testid="dropdown-choice"]')));
            await dropdownChoiceElement.click();
        }

        const choiceElement = await driver.wait(until.elementLocated(By.css('[data-testid="choice-1"]')));
        await choiceElement.click();
    } else {
        throw new Error(`Unknown choice type: ${choiceType}`);
    }
});

When('I enter the label name for choice', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    this.labelName = await labelNameInput.sendKeys('Sample Choice Label Name');
});

Then('I should see the label name for choice updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="label-name"]`)));
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, this.labelName);
});

When('I enter the help text for choice', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.helpText = await helpTextInput.sendKeys('Sample Choice help Name');
});

Then('I should see the help text for choice updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.helpText);
});

When('I enter the placeholder content for choice', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    this.placeholder = await placeholderTextInput.sendKeys('Sample Choice placeholder Name');
});

Then('I should see the placeholder content for choice updated in the section {int}', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    if( this.choiceType === 'dropdown') {
        const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-1-question-1"] [data-testid="input"]`)));
        const placeholderText = await placeholder.getAttribute('placeholder');
        assert.equal(placeholderText, this.placeholder);
    }
});