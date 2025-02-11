/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const path = require('path');
const Key = webdriver.Key

When('I upload {string} for section {int} page {int} question {int} and check counter',
    async function (fileType, sectionNumber, pageNumber, questionNumber) {

        // Map file type to sample files
        const fileMap = {
            photo: { testId: 'add-image', fileName: 'image.png', counterTestId: 'image-count' },
            video: { testId: 'add-video', fileName: 'sample1.mp4', counterTestId: 'video-count' },
            file: { testId: 'add-file', fileName: 'test.pdf', counterTestId: 'file-count' }
        };
    
        if (!fileMap[fileType]) {
            throw new Error(`Unsupported file type: ${fileType}`);
        }

        const { testId, fileName, counterTestId } = fileMap;

        // Locate the correct counter element
        let counterSelector = `[data-testid="${counterTestId}"]`;
        let countElement = await driver.wait(until.elementLocated(By.css(counterSelector)), 5000);
        let initialText = await countElement.getText();
        
        // Extract numeric count from text
        let match = initialText.match(/\d+/);
        if (!match) {
            throw new Error(`Could not extract count from text: "${initialText}"`);
        }

        let initialCount = parseInt(match[0]);
        console.log(`Initial count for ${fileType}: ${initialCount}`);

        console.log(`Uploading ${fileType} using testId: ${testId}`);

        // Locate the correct upload button dynamically
        let uploadSelector = `[data-testid="preview-section-${sectionNumber - 1}-page-${pageNumber - 1}-question-${questionNumber - 1}"] [data-testid="${testId}"]`;
        console.log(`Looking for upload element: ${uploadSelector}`);

        let uploadElement = await driver.wait(until.elementLocated(By.css(uploadSelector)), 5000);
    
        // Upload the file
        const filePath = path.resolve(__dirname, `../../support/${fileName}`);
        console.log(`Uploading file from: ${filePath}`);
        await uploadElement.sendKeys(filePath);

        // Wait for counter to decrease
        await driver.wait(async () => {
            let updatedText = await countElement.getText();
            let updatedMatch = updatedText.match(/\d+/);
            if (!updatedMatch) return false;
            let updatedCount = parseInt(updatedMatch[0]);
            return updatedCount === initialCount - 1;
        }, 5000);

        // Verify the final count
        let finalText = await countElement.getText();
        let finalMatch = finalText.match(/\d+/);
        if (!finalMatch) {
            throw new Error(`Could not extract final count from text: "${finalText}"`);
        }

        let finalCount = parseInt(finalMatch[0]);
        console.log(`Final count for ${fileType}: ${finalCount}`);
        assert.strictEqual(finalCount, initialCount - 1);
    });


