/* eslint-disable max-len */
const { Given, When, Then, But } = require('@cucumber/cucumber');
const { By, until, Key } = require('selenium-webdriver')

Given('I am on the questionnaire management section', async function () {
    await driver.get('http://example.com/questionnaire-management'); // Replace with actual URL
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="questionnaire-management-section"]')));
});

Then('I verify that I am on the same questionnaire management section which was created', async function () {
    await new Promise(resolve => setTimeout(resolve, 300));
    let check = false;
    let retries = 400;

    while (retries > 0) {
        const pageSource = await driver.getPageSource();
        check = pageSource.includes(global.internalName);

        if (check) {
            return 'passed';
        } else {
            await new Promise(resolve => setTimeout(resolve, 300));
            retries--;
        }
    }
    throw new Error(`Expected page source to contain "${global.internalName}", but it does not.`);
});

When('I add a new question to the page {int} in section {int}', async function (pageNumber, sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const addQuestionButton = await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber}-page-${pageNumber}"]`)));
    await addQuestionButton.click();
});

When('I enter the question in the page {int} in section {int}', async function (pageNumber, sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const questionBox = await driver.wait(until.elementLocated(By.css(`[data-testid="question-section-${sectionNumber}-page-${pageNumber}"]`)));
    await questionBox.sendKeys('New Question');
});

Then('I should see the question added in page {int} of section {int}', async function (pageNumber, sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="question-section-${sectionNumber}-page-${pageNumber}"]`)));
});

When('I click the add page button inside section with name {string}', async function (sectionName) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const addPageButton = await driver.wait(until.elementLocated(By.css(`[data-testid="add-page-button-${sectionName}"]`)));
    await addPageButton.click();
});

Then('I should see a new page with the name {string} added in {string}', async function (pageName, sectionName) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="page-${pageName}-${sectionName}"]`)));
});

When('I click the delete icon for the page with the name {string} in {string}', async function (pageName, sectionName) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const pageDiv = await driver.wait(until.elementLocated(By.css(`[data-testid="page-${pageName}-${sectionName}"]`)));
    const actions = driver.actions({ bridge: true });
    await actions.move({ origin: pageDiv }).perform(); // Hover over the div to reveal the delete icon
    const deleteIcon = await driver.wait(until.elementLocated(By.css(`[data-testid="delete-icon-page-${pageName}-${sectionName}"]`)));
    await deleteIcon.click();
});

Then('I should not see the page with the name {string} in {string}', async function (pageName, sectionName) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.stalenessOf(driver.findElement(By.css(`[data-testid="page-${pageName}-${sectionName}"]`))));
});

When('I click the add section button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const addSectionButton = await driver.wait(until.elementLocated(By.css('[data-testid="add-section-button"]')));
    await addSectionButton.click();
});

Then('I should see a new section with the name {string} added', async function (sectionName) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionName}"]`)));
});

Then('the new section should contain a page with the name {string}', async function (pageName) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="page-${pageName}"]`)));
});

When('I click the delete icon for the section with the name {string}', async function (sectionName) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const sectionDiv = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionName}"]`)));
    const actions = driver.actions({ bridge: true });
    await actions.move({ origin: sectionDiv }).perform(); // Hover over the div to reveal the delete icon
    const deleteIcon = await driver.wait(until.elementLocated(By.css(`[data-testid="delete-icon-section-${sectionName}"]`)));
    await deleteIcon.click();
});

Then('I should not see the section with the name {string} in the questionnaire', async function (sectionName) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.stalenessOf(driver.findElement(By.css(`[data-testid="section-${sectionName}"]`))));
});

When('I click the save button for section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const saveButton = await driver.wait(until.elementLocated(By.css(`[data-testid="save-button-section-${sectionNumber}"]`)));
    await saveButton.click();
});

Then('I should see the section {int} saved', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="save-${sectionNumber}"]`)));
});

When('I click the save button for the questionnaire version', async function(){
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="save"]`))).click();
});