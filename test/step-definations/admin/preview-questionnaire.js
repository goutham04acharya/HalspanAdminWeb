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
    await labelNameInput.sendKeys(this.photoLabelName );
});

Then('I should see the label name for photo updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));           
    const labelName = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="label-name"]`)));
    await driver.wait(until.elementIsVisible(labelName), 2000);
    const labelNameText = await labelName.getText();
    console.log(this.photoLabelName );
    assert.equal(labelNameText, this.photoLabelName );
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
    await driver.wait(until.elementLocated(By.css(`[data-testid="save-btn-${save-1}"]`))).click();
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

When('I enter the help text for textbox for preview',  async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const helpTextInput = await driver.wait(until.elementLocated(By.css('[data-testid="help-text-input"]')));
    await helpTextInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)

    await helpTextInput.sendKeys('Sample textbox Help Text');
    this.textBoxHelpText = 'Sample textbox Help Text'
});


When('I enter the placeholder content for textbox for preview', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const placeholderInput = await driver.wait(until.elementLocated(By.css('[data-testid="placeholder-input"]')));
    await placeholderInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE)

    await placeholderInput.sendKeys('Sample textbox placeholder');
    this.textBoxPlaceholder = 'Sample textbox placeholder'
});

Then('I should see the placeholder content updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const placeholder = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="input"]`)));
    const placeholderText = await placeholder.getAttribute('placeholder');
    assert.equal(placeholderText, this.textBoxPlaceholder);
});

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

When('I enter the help text for date\\/time for preview',  async function () {
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

Then('I should see the help text for textbox updated in the section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const helpText = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-page-${pageNumber}-question-${quesionNumber}"] [data-testid="help-text"]`)));
    const helpTextText = await helpText.getText();
    assert.equal(helpTextText, this.textBoxHelpText);
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
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('I validate the data entered exists in the mobile preview for section {int} page {int}', async function (int, int2) {
    // Then('I validate the data entered exists in the mobile preview for section {int} page {float}', function (int, float) {
    // Then('I validate the data entered exists in the mobile preview for section {float} page {int}', function (float, int) {
    // Then('I validate the data entered exists in the mobile preview for section {float} page {float}', function (float, float2) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I enter the text in textbox for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I enter the text in textbox for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I enter the text in textbox for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I enter the text in textbox for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I enter the text in textbox for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I enter the text in textbox for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I enter the text in textbox for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I enter the text in textbox for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I select the choice for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I select the choice for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I select the choice for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I select the choice for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I select the choice for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I select the choice for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I select the choice for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I select the choice for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I enter the date\\/time for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I enter the date\\/time for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I enter the date\\/time for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I enter the date\\/time for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I enter the date\\/time for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I enter the date\\/time for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I enter the date\\/time for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I enter the date\\/time for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I click the next button', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I upload photo for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I upload photo for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I upload photo for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I upload photo for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I upload photo for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I upload photo for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I upload photo for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I upload photo for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I see the floorplan for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I see the floorplan for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I see the floorplan for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I see the floorplan for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I see the floorplan for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I see the floorplan for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I see the floorplan for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I see the floorplan for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I enter the number for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I enter the number for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I enter the number for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I enter the number for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I enter the number for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I enter the number for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I enter the number for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I enter the number for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I enter the signature for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I enter the signature for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I enter the signature for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I enter the signature for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I enter the signature for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I enter the signature for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I enter the signature for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I enter the signature for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I select the location in asset location for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I select the location in asset location for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I select the location in asset location for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I select the location in asset location for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I select the location in asset location for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I select the location in asset location for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I select the location in asset location for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I select the location in asset location for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I see the display for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I see the display for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I see the display for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I see the display for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I see the display for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I see the display for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I see the display for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I see the display for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I see the gps for section {int} page {int} question {int}', async function (sectionNumber, pageNumber, quesionNumber) {
    // When('I see the gps for section {int} page {int} question {float}', function (int, int2, float) {
    // When('I see the gps for section {int} page {float} question {int}', function (int, float, int2) {
    // When('I see the gps for section {int} page {float} question {float}', function (int, float, float2) {
    // When('I see the gps for section {float} page {int} question {int}', function (float, int, int2) {
    // When('I see the gps for section {float} page {int} question {float}', function (float, int, float2) {
    // When('I see the gps for section {float} page {float} question {int}', function (float, float2, int) {
    // When('I see the gps for section {float} page {float} question {float}', function (float, float2, float3) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I click the back button', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});