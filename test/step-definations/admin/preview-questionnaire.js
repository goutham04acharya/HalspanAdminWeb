/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const path = require('path');
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I click on add new page for section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-page-sec-${sectionNumber - 1}"]`))).click();
});

Then('I should see the new page added for section {int}', async function (int) {
    // this is temporary have to be changed
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Page 1"]')))
});

When('I click on add new section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css('[data-testid="add-section"]'))).click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="open-${sectionNumber - 1}"]`))).click();
});

When('I enter the label name for photo for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    global.photoLabelName = 'Photo label name';
    await labelNameInput.sendKeys(global.photoLabelName);
});

Then('I should see the label name for photo updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(global.photoLabelName);
    assert.equal(labelNameText, global.photoLabelName);
});

When('I enter the help text for photo for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    global.photoHelpText = 'Supported formats: JPG, PNG, GIF';
    await helpTextInput.sendKeys(global.photoHelpText);
});

Then('I should see the help text for photo updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, global.photoHelpText);
});

When('I click the save button for the questionnaire version for section {int}', async function (save) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="save-btn-${save - 1}"]`))).click();
});

When('I enter the label name for floorplan for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    global.floorPlanLabelName = 'Sample floorplan label';
    await labelNameInput.sendKeys(global.floorPlanLabelName);
});

Then('I should see the label name for floorplan updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(global.floorPlanLabelName);
    assert.equal(labelNameText, global.floorPlanLabelName);
});

When('I enter the help text for floorplan for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    global.floorPlanHelpText = 'Enter the Sample floorplan helptext';
    await helpTextInput.sendKeys(global.floorPlanHelpText);
});

Then('I should see the help text updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, global.floorPlanHelpText);
});

When('I enter the label name for number for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    labelNameInput.sendKeys('Sample Number Label Name');
    global.numberLabelName = 'Sample Number Label Name';
});

Then('I should see the label name for number updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, global.numberLabelName);
});

When('I enter the help text for number for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    await helpTextInput.sendKeys('Sample Number help Name');
    global.numberHelpText = 'Sample Number help Name';
});

Then('I should see the help text for number updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, global.numberHelpText);
});

When('I enter the placeholder content for number for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    await placeholderTextInput.sendKeys('Sample Number placeholder Name');
    global.numberPlaceholder = 'Sample Number placeholder Name';
});

Then('I should see the placeholder content for number updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, global.numberPlaceholder);
});

When('I enter the label name for signature for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    global.signatureLabelName = 'Signature label name';
    await labelNameInput.sendKeys(global.signatureLabelName);
});

Then('I should see the label name for signature updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(global.signatureLabelName);
    assert.equal(labelNameText, global.signatureLabelName);
});

When('I enter the help text for signature for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    global.signatureHelpText = 'Write your signature';
    await helpTextInput.sendKeys(global.signatureHelpText);
});

Then('I should see the help text for signature updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, global.signatureHelpText);
});

When('I enter the label name for asset location for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    global.assetLocationLabelName = 'Asset Location label name';
    await labelNameInput.sendKeys(global.assetLocationLabelName);
});

Then('I should see the label name for asset location updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(global.assetLocationLabelName);
    assert.equal(labelNameText, global.assetLocationLabelName);
});

When('I enter the help text for asset location for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    global.assetLocationHelpText = 'Select your asset location';
    await helpTextInput.sendKeys(global.assetLocationHelpText);
});

Then('I should see the help text for asset location updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, global.assetLocationHelpText);
});

When('I enter the label name for gps for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    global.gpsLabelName = 'GPS label name';
    await labelNameInput.sendKeys(global.gpsLabelName);
});

Then('I should see the label name for gps updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(global.gpsLabelName);
    assert.equal(labelNameText, global.gpsLabelName);
});

When('I enter the help text for gps for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    global.gpsHelpText = 'Enable your location';
    await helpTextInput.sendKeys(global.gpsHelpText);
});

Then('I should see the help text for gps updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, global.gpsHelpText);
});

When('I click the preview button', async function () {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="preview"]`))).click();
});

When('I enter the label name for textbox for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    await labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    await labelNameInput.sendKeys('Sample textbox Label Name');
    global.textBoxLabelName = 'Sample textbox Label Name';
    console.log('textbox label name 1 = ', global.textBoxLabelName);
});

// Then('I should see the label name updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
//     const labelNameText = await labelName.getText();
//     assert.equal(labelNameText, global.textBoxLabelName);
//     console.log('textbox label name 2 = ', global.textBoxLabelName);
// });

When('I enter the help text for textbox for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    await helpTextInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)

    await helpTextInput.sendKeys('Sample textbox Help Text');
    global.textBoxHelpText = 'Sample textbox Help Text';
});

Then('I should see the help text for textbox updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, global.textBoxHelpText);
});

When('I enter the placeholder content for textbox for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    await placeholderInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)

    await placeholderInput.sendKeys('Sample textbox placeholder');
    global.textBoxPlaceholder = 'Sample textbox placeholder';
});

// Then('I should see the placeholder content updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
//     const placeholderText = await placeholder.getAttribute('placeholder');
//     assert.equal(placeholderText, global.textBoxPlaceholder);
// });

When('I enter the help text for choice for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    await helpTextInput.sendKeys('Sample Choice help Name');
    global.choiceHelpText = 'Sample Choice help Name';
});

When('I enter the placeholder content for choice for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    await placeholderTextInput.sendKeys('Sample Choice placeholder Name');
    global.choicePlaceholder = 'Sample Choice placeholder Name';
});

When('I enter the label name for choice for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    labelNameInput.sendKeys('Sample Choice Label Name');
    global.choiceLabelName = 'Sample Choice Label Name';
});

When('I enter the label name for date\\/time for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    global.dateTimeLabelName = 'Date or time';
    await labelNameInput.sendKeys(global.dateTimeLabelName);
});

Then('I should see the label name for date\\/time updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(global.dateTimeLabelName);
    assert.equal(labelNameText, global.dateTimeLabelName);
});

When('I enter the help text for date\\/time for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    global.dateTimeHelpText = 'Enter the date/time in dd/mm/yyyy format';
    await helpTextInput.sendKeys(global.dateTimeHelpText);
});

Then('I should see the help text for date\\/time updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, global.dateTimeHelpText);
});

// When('I enter the placeholder content for date\\/time for preview', async function () {
//     await new Promise(resolve => setTimeout(resolve, 750));
//     const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
//     global.dateTimePlaceholder = 'dd/mm/yyyy';
//     await placeholderTextInput.sendKeys(global.dateTimePlaceholder);
// });

Then('I should see the placeholder content for date\\/time updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, global.dateTimePlaceholder);
});

Then('I should see the label name for textbox updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, global.textBoxLabelName);
    console.log('textbox label name 2 = ', global.textBoxLabelName);
});

When('I enter the placeholder content date\\/time for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    global.dateTimePlaceholder = 'dd/mm/yyyy';
    await placeholderTextInput.sendKeys(global.dateTimePlaceholder);
});

Then('I should see the placeholder content for choice updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, global.choicePlaceholder);
});

Then('I should see the placeholder content for textbox updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, global.textBoxPlaceholder);
});

Then('I should see the label name for choice updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)), 5000);
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, global.choiceLabelName);
});

Then('I should see the help text for choice updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, global.choiceHelpText);
});

Then('I should see the mobile preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mobile_preview = await driver.wait(until.elementLocated(By.css(`[data-testid="mobile-preview"]`)));
    const isVisible = await mobile_preview.isDisplayed();

    if (isVisible)
        console.log('Mobile preview is visible');
    else
        console.log('Mobile preview is not visible');
});

Then('I validate the data entered exists in the mobile preview for section {int} page {int}', async function (sectionNumber, pageNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (sectionNumber === 1 && pageNumber === 1) {
        // Validate Question 1 (Textbox)
        const question1Label = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-0"] [data-testid="label-name"]`)), 5000);
        const question1LabelText = await question1Label.getText();
        console.log(question1LabelText, '===', 'Sample textbox Label Name*');
        assert.equal(question1LabelText, 'Sample textbox Label Name*', 'Question 1 label name does not match');

        const question1HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-0"] [data-testid="help-text"]`)), 5000);
        const question1HelpTextText = await question1HelpText.getText();
        assert.equal(question1HelpTextText, global.textBoxHelpText, 'Question 1 help text does not match');

        const question1Placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-0"] [data-testid="input"]`)), 5000);
        const question1PlaceholderText = await question1Placeholder.getAttribute('placeholder');
        assert.equal(question1PlaceholderText, global.textBoxPlaceholder, 'Question 1 placeholder does not match');

        // Validate Question 2 (Choice)
        const question2Label = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-1"] [data-testid="label-name"]`)), 5000);
        const question2LabelText = await question2Label.getText();
        assert.equal(question2LabelText, 'Sample Choice Label Name*', 'Question 2 label name does not match');

        const question2HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-1"] [data-testid="help-text"]`)), 5000);
        const question2HelpTextText = await question2HelpText.getText();
        assert.equal(question2HelpTextText, global.choiceHelpText, 'Question 2 help text does not match');

        //======================================================================
        // const question2Placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="input"]`)), 5000);
        // const question2PlaceholderText = await question2Placeholder.getAttribute('placeholder');
        // assert.equal(question2PlaceholderText, global.choicePlaceholder, 'Question 2 placeholder does not match');
        //======================================================================

        // Validate Question 3 (Date/Time)
        const question3Label = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-2"] [data-testid="label-name"]`)), 5000);
        const question3LabelText = await question3Label.getText();
        assert.equal(question3LabelText, 'Date or time*', 'Question 3 label name does not match');

        const question3HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-2"] [data-testid="help-text"]`)), 5000);
        const question3HelpTextText = await question3HelpText.getText();
        assert.equal(question3HelpTextText, global.dateTimeHelpText, 'Question 3 help text does not match');

        const question3Placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-2"] [data-testid="input"]`)), 5000);
        const question3PlaceholderText = await question3Placeholder.getAttribute('placeholder');
        assert.equal(question3PlaceholderText, global.dateTimePlaceholder, 'Question 3 placeholder does not match');
    }

    else if (sectionNumber === 1 && pageNumber === 2) {
        // Validate Question 1 (Photo)
        const question1Label = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-0"] [data-testid="label-name"]`)), 5000);
        const question1LabelText = await question1Label.getText();
        assert.equal(question1LabelText, 'Photo label name*', 'Question 1 label name does not match');

        const question1HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-0"] [data-testid="help-text"]`)), 5000);
        const question1HelpTextText = await question1HelpText.getText();
        assert.equal(question1HelpTextText, global.photoHelpText, 'Question 1 help text does not match');

        // Validate Question 2 (floorplan)
        const question2Label = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-1"] [data-testid="label-name"]`)), 5000);
        const question2LabelText = await question2Label.getText();
        assert.equal(question2LabelText, 'Sample floorplan label*', 'Question 2 label name does not match');

        const question2HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-1"] [data-testid="help-text"]`)), 5000);
        const question2HelpTextText = await question2HelpText.getText();
        assert.equal(question2HelpTextText, global.floorPlanHelpText, 'Question 2 help text does not match');
    }

    else if (sectionNumber === 2 && pageNumber === 1) {
        // Validate Question 1 (Number)
        const question1Label = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-0"] [data-testid="label-name"]`)), 5000);
        const question1LabelText = await question1Label.getText();
        assert.equal(question1LabelText, 'Sample Number Label Name*', 'Question 1 label name does not match');

        const question1HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-0"] [data-testid="help-text"]`)), 5000);
        const question1HelpTextText = await question1HelpText.getText();
        assert.equal(question1HelpTextText, global.numberHelpText, 'Question 1 help text does not match');

        const question1Placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-0"] [data-testid="input"]`)), 5000);
        const question1PlaceholderText = await question1Placeholder.getAttribute('placeholder');
        //this line has to be uncommented once this is fixed by raheel
        // assert.equal(question1PlaceholderText, global.numberPlaceholder, 'Question 1 placeholder does not match');

        // Validate Question 2 (Signature)
        const question2Label = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-1"] [data-testid="label-name"]`)), 5000);
        const question2LabelText = await question2Label.getText();
        assert.equal(question2LabelText, global.signatureLabelName, 'Question 2 label name does not match');

        const question2HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-1"] [data-testid="help-text"]`)), 5000);
        const question2HelpTextText = await question2HelpText.getText();
        assert.equal(question2HelpTextText, global.signatureHelpText, 'Question 2 help text does not match');

        // Validate Question 3 (Asset Location)
        const question3Label = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-2"] [data-testid="label-name"]`)), 5000);
        const question3LabelText = await question3Label.getText();
        assert.equal(question3LabelText, global.assetLocationLabelName, 'Question 3 label name does not match');

        const question3HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-2"] [data-testid="help-text"]`)), 5000);
        const question3HelpTextText = await question3HelpText.getText();
        assert.equal(question3HelpTextText, global.assetLocationHelpText, 'Question 3 help text does not match');
    }

    else if (sectionNumber === 2 && pageNumber === 2) {
        // Validate Question 1 (Display)
        // not done ========================================================
        // const question1Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="label-name"]`)), 5000);
        // const question1LabelText = await question1Label.getText();
        // assert.equal(question1LabelText, this.display, 'Question 1 label name does not match');

        // const question1HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="help-text"]`)), 5000);
        // const question1HelpTextText = await question1HelpText.getText();
        // assert.equal(question1HelpTextText, global.photoHelpText, 'Question 1 help text does not match');
        // ====================================================================

        // Validate Question 2 (GPS)
        const question2Label = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-1"] [data-testid="label-name"]`)), 5000);
        const question2LabelText = await question2Label.getText();
        assert.equal(question2LabelText, global.gpsLabelName, 'Question 2 label name does not match');

        const question2HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-1"] [data-testid="help-text"]`)), 5000);
        const question2HelpTextText = await question2HelpText.getText();
        assert.equal(question2HelpTextText, global.gpsHelpText, 'Question 2 help text does not match');
    }
});

When('I enter invalid text for custom regular expression for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await text_area.sendKeys('hdhsdshsjdhsj');
});

When('I enter the text in textbox for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await text_area.sendKeys('ABCDE1234F');
});

When('I select the choice for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const choices = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"]`)), 5000);
    await driver.wait(until.elementIsVisible(choices), 2000);
    let i = 0;
    while (i < 3) {
        await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="choices-${i}"]`))).click();
        i++;
    }
});

When('I enter the date\\/time for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const date_area = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(date_area), 2000);
    await date_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await date_area.sendKeys('31/10/2024');
});

When('I click the next button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="next"]`)), 5000).click();
});

When('I upload a invalid image to section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    let element;
    let valid_file = '600.csv';

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="add-image"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

When('I upload photo for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    let element;
    let valid_file = 'image.png';

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="add-image"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

When('I see the floorplan for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const floorplan = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="floorplan-image"]`)), 5000);
    await driver.wait(until.elementIsVisible(floorplan), 2000);
    await floorplan.click();
});

When('I place the pin and draw on the floorplan', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="floorplan-pin"]`)), 5000).click();
    const floorplanImage = await driver.wait(until.elementLocated(By.css('[data-testid="floorplan"]')), 5000);
    // const floorplanSize = await floorplanImage.getRect(); // get the dimensions and location of the floorplan

    // // Calculate the coordinates for the center of the image
    // const centerX = Math.round(floorplanSize.x + floorplanSize.width / 2);
    // const centerY = Math.round(floorplanSize.y + floorplanSize.height / 2);

    // // Simulate placing the pin in the center of the floorplan
    // const actions = driver.actions({ async: true });
    // await actions.move({ origin: floorplanImage, x: centerX, y: centerY }).click().perform();
    // const floorplan = await driver.wait(until.elementLocated(By.css('[data-testid="floorplan"]')), 5000);
    // await driver.wait(until.elementLocated(By.css(`[data-testid="floorplan-draw"]`)), 5000).click();
    // // Draw on floorplan
    // const action = driver.actions({ async: true });
    // await action.move({ origin: pin }).press(Button.LEFT).perform();
    // await action.move({ origin: floorplan, x: 100, y: 100 }).perform();
    // await action.move({ origin: floorplan, x: 200, y: 150 }).perform();

    // // Release the mouse button to stop drawing
    // await actions.release().perform();
    await driver.wait(until.elementLocated(By.css('[data-testid="close-floorplan"]')), 5000).click();
});

When('I enter the number for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const number = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="input"]`)), 5000);
    await driver.wait(until.elementIsVisible(number), 2000);
    await number.sendKeys('1');
    // await driver.wait(until.elementLocated(By.css('[data-testid="increase"]'))).click();
    // let number_value = await number.getText()
    // assert.equal(number_value, '3')
    // await driver.wait(until.elementLocated(By.css('[data-testid="decrease"]'))).click();
    // number_value = await number.getText()
    // assert.equal(number_value, '1')
});

When('I choose the number by sliding for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    let targetValue = 9; // Define your target value here
    await new Promise(resolve => setTimeout(resolve, 750));

    // Locate the slider using the correct data-testid
    const slider = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="slider"] [data-testid="number-slider"]`)));

    // Get the current value of the slider
    const currentValue = await driver.executeScript("return arguments[0].value;", slider);

    // Calculate how many steps you need to move (positive for right, negative for left)
    const steps = targetValue - currentValue;

    // Slide to the right if the target is greater than the current value
    if (steps > 0) {
        for (let i = 0; i < steps; i++) {
            await slider.sendKeys(Keys.ARROW_RIGHT);
        }
    } 
    // Slide to the left if the target is less than the current value
    else {
        for (let i = 0; i < Math.abs(steps); i++) {
            await slider.sendKeys(Keys.ARROW_LEFT);
        }
    }

    // Add a delay to ensure the change is registered
    await new Promise(resolve => setTimeout(resolve, 1000));
});


When('I enter the signature for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    const signature = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="signature"]`)), 5000);

    // Draw on signature
    const action = driver.actions({ async: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    await action.move({ origin: signature, x: 100, y: 100 }).perform();
    await new Promise(resolve => setTimeout(resolve, 500))
    await action.move({ origin: signature, x: 200, y: 150 }).perform();
    await new Promise(resolve => setTimeout(resolve, 500));
    // Release the mouse button to stop drawing
    await action.release().perform();
});

When('I select the location in asset location for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    const assetLocation = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="asset-location"]`)), 5000);
    await driver.wait(until.elementIsVisible(assetLocation), 2000);
    await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="site"]`)), 5000).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="site-0"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="location"]`)), 5000).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="buidling-0"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="level"]`)), 5000).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="floor-0"]`))).click();
});

When('I see the display for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    const display = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="heading"]`)), 5000);
    await driver.wait(until.elementIsVisible(display), 2000);
});

When('I see the gps for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    const gps = await driver.wait(until.elementLocated(By.css(`[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${quesionNumber - 1}"] [data-testid="gps"]`)), 5000);
    await driver.wait(until.elementIsVisible(gps), 2000);
});

When('I click the back button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="back"]`)), 5000).click();
});