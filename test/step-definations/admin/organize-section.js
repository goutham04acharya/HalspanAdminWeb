/* eslint-disable max-len */
const { Given, When, Then, But } = require('@cucumber/cucumber');
const { By, until, Key } = require('selenium-webdriver')

Given('I am on the questionnaire management section', async function () {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const questionnaireId = global.response?.data?.data?.questionnaire_id;
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const versionNumber = global.response?.data?.data?.version_number;

    if (questionnaireId && versionNumber) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await driver.get(`http://localhost:3000/questionnaries/create-questionnary/questionnary-form/${questionnaireId}/${versionNumber}`); // Replace with actual URL
        await new Promise((resolve) => setTimeout(resolve, 500));
        const pageSource = await driver.getPageSource();
        check = pageSource.includes(global.internalName);
    } else {
        throw new Error('Questionnaire ID or version number is missing.');
    }
});

When('I click on add new section', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="add-section"]'))).click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css('[data-testid="sidebar-section-1"]'))).click();
});

Then("I should see the new section added", async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Section 2"]')))
});

When('I click on add new page', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="add-page-sec-0"]'))).click()
});

Then('I should see the new pages added', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Page 1"]')))
});

When('I click on save button for section 2', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="save"]'))).click()
});

When('I click on save button for section 1', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="save"]'))).click()
});

When('I click on delete page from section 1', async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="delete-page-sec-0-0"]'))).click()
});

Then('The page should be deleted from section', async function() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        const element = await driver.findElement(By.xpath('//p[text()="Page 1"]'));
        await driver.wait(until.stalenessOf(element), 10000);
    } catch (error) {
        if (error.name === 'NoSuchElementError') {
            // Element is already not present, which means it has been deleted
            return;
        } else {
            // Re-throw the error if it's not a NoSuchElementError
            throw error;
        }
    }
});

When('I click on delete section 2', async function(){
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="delete-btn-1"]'))).click()
});

When('I click on delete section 1', async function(){
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await driver.wait(until.elementLocated(By.css('[data-testid="delete-btn-0"]'))).click()
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const element = await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber}-page-${pageNumber}"]`)), 5000);
    await driver.wait(until.elementIsVisible(element), 2000);
    await element.click();
    console.log(`New question has added to section ${sectionNumber} page ${pageNumber}`);
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
    // await driver.wait(until.elementLocated(By.css(`[data-testid="save-btn-0"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="save"]`))).click();
});

Then('I should see confirmation prompt for delete page', async function () {
    // Write code here that turns the phrase above into concrete actions
    await driver.wait(until.elementLocated(By.xpath(`//*[text()='Delete Page']`)))
});
  
When('I click on confirm delete page button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const deleteButton = await driver.wait(until.elementLocated(By.css(`[data-testid="confirm-delete-page"]`)));
    await deleteButton.click();
});

Then('I should see confirmation prompt for delete section', async function () {
    // Write code here that turns the phrase above into concrete actions
    await driver.wait(until.elementLocated(By.xpath(`//*[text()='Delete Section']`)))
});
  
When('I click on confirm delete section button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const deleteButton = await driver.wait(until.elementLocated(By.css(`[data-testid="confirm-delete"]`)));
    await deleteButton.click();
});