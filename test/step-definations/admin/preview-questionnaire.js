/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I click on add new page for section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-page-sec-${sectionNumber}"]`))).click();
});

Then('I should see the new page added for section {int}', async function (int) {
    // this is temporary have to be changed
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.xpath('//p[text()="Page 1"]')))
});

When('I enter the label name for photo for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.photoLabelName = 'Photo label name';
    await labelNameInput.sendKeys(this.photoLabelName);
});

Then('I should see the label name for photo updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.photoLabelName);
    assert.equal(labelNameText, this.photoLabelName);
});

When('I enter the help text for photo for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.photoHelpText = 'Supported formats: JPG, PNG, GIF';
    await helpTextInput.sendKeys(this.photoHelpText);
});

Then('I should see the help text for photo updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.photoHelpText);
});

When('I click the save button for the questionnaire version for section {int}', async function (save) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="save-btn-${save - 1}"]`))).click();
});

When('I enter the label name for floorplan for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.floorPlanLabelName = 'Sample floorplan label';
    await labelNameInput.sendKeys(this.floorPlanLabelName);
});

Then('I should see the label name for floorplan updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.floorPlanLabelName);
    assert.equal(labelNameText, this.floorPlanLabelName);
});

When('I enter the help text for floorplan for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.floorPlanHelpText = 'Enter the Sample floorplan helptext';
    await helpTextInput.sendKeys(this.floorPlanHelpText);
});

Then('I should see the help text updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.floorPlanHelpText);
});

When('I enter the label name for number for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    labelNameInput.sendKeys('Sample Number Label Name');
    this.numberLabelName = 'Sample Number Label Name';
});

Then('I should see the label name for number updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, this.numberLabelName);
});

When('I enter the help text for number for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    await helpTextInput.sendKeys('Sample Number help Name');
    this.numberHelpText = 'Sample Number help Name';
});

Then('I should see the help text for number updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.numberHelpText);
});

When('I enter the placeholder content for number for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    await placeholderTextInput.sendKeys('Sample Number placeholder Name');
    this.numberPlaceholder = 'Sample Number placeholder Name';
});

Then('I should see the placeholder content for number updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, this.numberPlaceholder);
});

When('I enter the label name for signature for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.signatureLabelName = 'Signature label name';
    await labelNameInput.sendKeys(this.signatureLabelName);
});

Then('I should see the label name for signature updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.signatureLabelName);
    assert.equal(labelNameText, this.signatureLabelName);
});

When('I enter the help text for signature for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.signatureHelpText = 'Write your signature';
    await helpTextInput.sendKeys(this.signatureHelpText);
});

Then('I should see the help text for signature updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.signatureHelpText);
});

When('I enter the label name for asset location for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.assetLocationLabelName = 'Asset Location label name';
    await labelNameInput.sendKeys(this.assetLocationLabelName);
});

Then('I should see the label name for asset location updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.assetLocationLabelName);
    assert.equal(labelNameText, this.assetLocationLabelName);
});

When('I enter the help text for asset location for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.assetLocationHelpText = 'Select your asset location';
    await helpTextInput.sendKeys(this.assetLocationHelpText);
});

Then('I should see the help text for asset location updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.assetLocationHelpText);
});

When('I enter the label name for gps for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.gpsLabelName = 'GPS label name';
    await labelNameInput.sendKeys(this.gpsLabelName);
});

Then('I should see the label name for gps updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.gpsLabelName);
    assert.equal(labelNameText, this.gpsLabelName);
});

When('I enter the help text for gps for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.gpsHelpText = 'Enable your location';
    await helpTextInput.sendKeys(this.gpsHelpText);
});

Then('I should see the help text for gps updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.gpsHelpText);
});

When('I click the preview button', async function () {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="preview"]`))).click();
});

When('I enter the label name for textbox for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    await labelNameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)
    await labelNameInput.sendKeys('Sample textbox Label Name');
    this.textBoxLabelName = 'Sample textbox Label Name'
});

Then('I should see the label name updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, this.textBoxLabelName);
});

When('I enter the help text for textbox for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    await helpTextInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)

    await helpTextInput.sendKeys('Sample textbox Help Text');
    this.textBoxHelpText = 'Sample textbox Help Text'
});

Then('I should see the help text for textbox updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.textBoxHelpText);
});

When('I enter the placeholder content for textbox for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    await placeholderInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)

    await placeholderInput.sendKeys('Sample textbox placeholder');
    this.textBoxPlaceholder = 'Sample textbox placeholder'
});

// Then('I should see the placeholder content updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
//     const placeholderText = await placeholder.getAttribute('placeholder');
//     assert.equal(placeholderText, this.textBoxPlaceholder);
// });

When('I enter the help text for choice for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    await helpTextInput.sendKeys('Sample Choice help Name');
    this.choiceHelpText = 'Sample Choice help Name';
});

When('I enter the placeholder content for choice for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    await placeholderTextInput.sendKeys('Sample Choice placeholder Name');
    this.choicePlaceholder = 'Sample Choice placeholder Name';
});

When('I enter the label name for choice for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    labelNameInput.sendKeys('Sample Choice Label Name');
    this.choiceLabelName = 'Sample Choice Label Name';
});

When('I enter the label name for date\\/time for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const labelNameInput = await driver.wait(until.elementLocated(By.css('[data-testid="label-name-input"]')));
    labelNameInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE)
    this.dateTimeLabelName = 'Date or time';
    await labelNameInput.sendKeys(this.dateTimeLabelName);
});

Then('I should see the label name for date\\/time updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.dateTimeLabelName);
    assert.equal(labelNameText, this.dateTimeLabelName);
});

When('I enter the help text for date\\/time for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    this.dateTimeHelpText = 'Enter the date/time in dd/mm/yyyy format';
    await helpTextInput.sendKeys(this.dateTimeHelpText);
});

Then('I should see the help text for date\\/time updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.dateTimeHelpText);
});

When('I enter the placeholder content for date\\/time for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    this.dateTimePlaceholder = 'dd-mm-yyyy';
    await placeholderTextInput.sendKeys(this.dateTimePlaceholder);
});

Then('I should see the placeholder content for date\\/time updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, this.dateTimePlaceholder);
});

Then('I should see the label name for textbox updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, this.textBoxLabelName);
});

When('I enter the placeholder content date\\/time for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    this.dateTimePlaceholder = 'dd-mm-yyyy';
    await placeholderTextInput.sendKeys(this.dateTimePlaceholder);
});

Then('I should see the placeholder content for choice updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, this.choicePlaceholder);
});

Then('I should see the placeholder content for textbox updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, this.textBoxPlaceholder);
});

Then('I should see the label name for choice updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)), 5000);
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    assert.equal(labelNameText, this.choiceLabelName);
});

Then('I should see the help text for choice updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.choiceHelpText);
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
        const question1Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="label-name"]`)), 5000);
        const question1LabelText = await question1Label.getText();
        assert.equal(question1LabelText, this.textBoxLabelName, 'Question 1 label name does not match');

        const question1HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="help-text"]`)), 5000);
        const question1HelpTextText = await question1HelpText.getText();
        assert.equal(question1HelpTextText, this.textBoxHelpText, 'Question 1 help text does not match');

        const question1Placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="input"]`)), 5000);
        const question1PlaceholderText = await question1Placeholder.getAttribute('placeholder');
        assert.equal(question1PlaceholderText, this.textBoxPlaceholder, 'Question 1 placeholder does not match');

        // Validate Question 2 (Choice)
        const question2Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="label-name"]`)), 5000);
        const question2LabelText = await question2Label.getText();
        assert.equal(question2LabelText, this.choiceLabelName, 'Question 2 label name does not match');

        const question2HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="help-text"]`)), 5000);
        const question2HelpTextText = await question2HelpText.getText();
        assert.equal(question2HelpTextText, this.choiceHelpText, 'Question 2 help text does not match');

        const question2Placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="input"]`)), 5000);
        const question2PlaceholderText = await question2Placeholder.getAttribute('placeholder');
        assert.equal(question2PlaceholderText, this.choicePlaceholder, 'Question 2 placeholder does not match');

        // Validate Question 3 (Date/Time)
        const question3Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-3"] [data-testid="label-name"]`)), 5000);
        const question3LabelText = await question3Label.getText();
        assert.equal(question3LabelText, this.dateTimeLabelName, 'Question 3 label name does not match');

        const question3HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-3"] [data-testid="help-text"]`)), 5000);
        const question3HelpTextText = await question3HelpText.getText();
        assert.equal(question3HelpTextText, this.dateTimeHelpText, 'Question 3 help text does not match');

        const question3Placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-3"] [data-testid="input"]`)), 5000);
        const question3PlaceholderText = await question3Placeholder.getAttribute('placeholder');
        assert.equal(question3PlaceholderText, this.dateTimePlaceholder, 'Question 3 placeholder does not match');
    }

    else if (sectionNumber === 1 && pageNumber === 2) {
        // Validate Question 1 (Photo)
        const question1Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="label-name"]`)), 5000);
        const question1LabelText = await question1Label.getText();
        assert.equal(question1LabelText, this.photoLabelName, 'Question 1 label name does not match');

        const question1HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="help-text"]`)), 5000);
        const question1HelpTextText = await question1HelpText.getText();
        assert.equal(question1HelpTextText, this.photoHelpText, 'Question 1 help text does not match');

        // Validate Question 2 (floorplan)
        const question2Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="label-name"]`)), 5000);
        const question2LabelText = await question2Label.getText();
        assert.equal(question2LabelText, this.floorPlanLabelName, 'Question 2 label name does not match');

        const question2HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="help-text"]`)), 5000);
        const question2HelpTextText = await question2HelpText.getText();
        assert.equal(question2HelpTextText, this.floorPlanHelpText, 'Question 2 help text does not match');
    }

    else if (sectionNumber === 2 && pageNumber === 1) {
        // Validate Question 1 (Number)
        const question1Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="label-name"]`)), 5000);
        const question1LabelText = await question1Label.getText();
        assert.equal(question1LabelText, this.numberLabelName, 'Question 1 label name does not match');

        const question1HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="help-text"]`)), 5000);
        const question1HelpTextText = await question1HelpText.getText();
        assert.equal(question1HelpTextText, this.numberHelpText, 'Question 1 help text does not match');

        const question1Placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="input"]`)), 5000);
        const question1PlaceholderText = await question1Placeholder.getAttribute('placeholder');
        assert.equal(question1PlaceholderText, this.numberPlaceholder, 'Question 1 placeholder does not match');

        // Validate Question 2 (Signature)
        const question2Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="label-name"]`)), 5000);
        const question2LabelText = await question2Label.getText();
        assert.equal(question2LabelText, this.signatureLabelName, 'Question 2 label name does not match');

        const question2HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="help-text"]`)), 5000);
        const question2HelpTextText = await question2HelpText.getText();
        assert.equal(question2HelpTextText, this.signatureHelpText, 'Question 2 help text does not match');

        // Validate Question 3 (Asset Location)
        const question3Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-3"] [data-testid="label-name"]`)), 5000);
        const question3LabelText = await question3Label.getText();
        assert.equal(question3LabelText, this.assetLocationLabelName, 'Question 3 label name does not match');

        const question3HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-3"] [data-testid="help-text"]`)), 5000);
        const question3HelpTextText = await question3HelpText.getText();
        assert.equal(question3HelpTextText, this.assetLocationHelpText, 'Question 3 help text does not match');
    }

    else if (sectionNumber === 2 && pageNumber === 2) {
        // Validate Question 1 (Display)
        // not done ========================================================
        // const question1Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="label-name"]`)), 5000);
        // const question1LabelText = await question1Label.getText();
        // assert.equal(question1LabelText, this.display, 'Question 1 label name does not match');

        // const question1HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-1"] [data-testid="help-text"]`)), 5000);
        // const question1HelpTextText = await question1HelpText.getText();
        // assert.equal(question1HelpTextText, this.photoHelpText, 'Question 1 help text does not match');
        // ====================================================================

        // Validate Question 2 (GPS)
        const question2Label = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="label-name"]`)), 5000);
        const question2LabelText = await question2Label.getText();
        assert.equal(question2LabelText, this.gpsLabelName, 'Question 2 label name does not match');

        const question2HelpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-2"] [data-testid="help-text"]`)), 5000);
        const question2HelpTextText = await question2HelpText.getText();
        assert.equal(question2HelpTextText, this.gpsHelpText, 'Question 2 help text does not match');
    }
});

When('I enter invalid text for custom regular expression', async function() {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="text-area"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await text_area.sendKeys('hdhsdshsjdhsj');
});

When('I enter the text in textbox for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const text_area = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="text-area"]`)), 5000);
    await driver.wait(until.elementIsVisible(text_area), 2000);
    await text_area.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
    await text_area.sendKeys('ABCDE1234F');
});

When('I select the choice for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const choices = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="choices"]`)), 5000);
    await driver.wait(until.elementIsVisible(choices), 2000);
    let i = 0;
    while(i < 3) {
        await driver.wait(until.elementLocated(By.css(`[data-testid="choice-${i+1}"]`))).click();
    }
});

When('I enter the date\\/time for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const date_area = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="date-area"]`)), 5000);
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
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="add-image"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

When('I upload photo for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    let element;
    let valid_file = 'image.png';

    await new Promise(resolve => setTimeout(resolve, 5000));
    if (valid_file !== '') {
        element = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="add-image"]`)));
        const filePath = path.join(__dirname, `../../support/${valid_file}`);
        await element.sendKeys(filePath);
    }
});

When('I see the floorplan for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const floorplan = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="floorplan-image"]`)), 5000);
    await driver.wait(until.elementIsVisible(floorplan), 2000);
    await floorplan.click();
});

When('I place the pin and draw on the floorplan', async function() {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="pin"]`)), 5000).click();
    const floorplanImage = await driver.wait(until.elementLocated(By.css('[data-testid="floorplan"]')), 5000);
    const floorplanSize = await floorplanImage.getRect(); // get the dimensions and location of the floorplan

    // Calculate the coordinates for the center of the image
    const centerX = Math.round(floorplanSize.x + floorplanSize.width / 2);
    const centerY = Math.round(floorplanSize.y + floorplanSize.height / 2);

    // Simulate placing the pin in the center of the floorplan
    const actions = driver.actions({ async: true });
    await actions.move({ origin: floorplanImage, x: centerX, y: centerY }).click().perform();
    const floorplan = await driver.wait(until.elementLocated(By.css('[data-testid="floorplan"]')), 5000);

    // Draw on floorplan
    const action = driver.actions({ async: true });
    await action.move({ origin: pin }).press(Button.LEFT).perform();
    await action.move({ origin: floorplan, x: 100, y: 100 }).perform();
    await action.move({ origin: floorplan, x: 200, y: 150 }).perform();

    // Release the mouse button to stop drawing
    await actions.release().perform();
});

When('I enter the number for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const number = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="number"]`)), 5000);
    await driver.wait(until.elementIsVisible(number), 2000);
    await number.sendKeys('1');
    await driver.wait(until.elementLocated(By.css('[data-testid="increase"]'))).click();
    let number_value = await number.getText()
    assert.equal(number_value, '3')
    await driver.wait(until.elementLocated(By.css('[data-testid="decrease"]'))).click();
    number_value = await number.getText()
    assert.equal(number_value, '1')
});

When('I choose the number by sliding for section 2 page 1 question 1', async function(sectionNumber, pageNumber, quesionNumber) {
    let targetValue = 9;
    await new Promise(resolve => setTimeout(resolve, 750));
    const slider = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="slider"]`)));
    const currentValue = await driver.executeScript("return arguments[0].value;", slider);
    const steps = targetValue - currentValue;

    if (steps > 0) {
        for (let i = 0; i < steps; i++) {
            await slider.sendKeys(Keys.ARROW_RIGHT);
        }
    } else {
        for (let i = 0; i < Math.abs(steps); i++) {
            await slider.sendKeys(Keys.ARROW_LEFT);
        }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
});

When('I enter the signature for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    const signature = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="signature"]`)), 5000);

    // Draw on signature
    const action = driver.actions({ async: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    await action.move({ origin: signature, x: 100, y: 100 }).perform();
    await new Promise(resolve => setTimeout(resolve, 500))
    await action.move({ origin: signature, x: 200, y: 150 }).perform();
    await new Promise(resolve => setTimeout(resolve, 500))
    // Release the mouse button to stop drawing
    await actions.release().perform();
});

When('I select the location in asset location for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    const assetLocation = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="asset-location"]`)), 5000);
    await driver.wait(until.elementIsVisible(assetLocation), 2000);
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="site"]`)), 5000).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="site-0"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="building"]`)), 5000).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="building-0"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="floorplan"]`)), 5000).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="floorplan-0"]`))).click();   
});

When('I see the display for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    const display = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="display"]`)), 5000);
    await driver.wait(until.elementIsVisible(display), 2000);
});

When('I see the gps for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    const gps = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="gps"]`)), 5000);
    await driver.wait(until.elementIsVisible(gps), 2000);
});

When('I click the back button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="back"]`)), 5000).click();
});