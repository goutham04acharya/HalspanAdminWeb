/* eslint-disable complexity */
/* eslint-disable max-len */
const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Keys = webdriver.Key


When('I click the add section button for {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const addSectionButton = await driver.wait(until.elementLocated(By.css('[data-testid="add-section"]')));
    await addSectionButton.click();
    console.log("section number:", sectionNumber);
    await driver.wait(until.elementLocated(By.css(`[data-testid="sidebar-section-${sectionNumber}"]`))).click();
});

When('I add {int} pages to the section {int}', async function (pagesNumber, sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Page number: ", pagesNumber);
    for (let i = pagesNumber; i > 0; i--) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        await driver.wait(until.elementLocated(By.css(`[data-testid="add-page-sec-${sectionNumber}"]`))).click();
    }
    await driver.wait(until.elementLocated(By.css(`[data-testid="save"]`))).click();
});


When('I click on the section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
        const section = await driver.wait(
            until.elementLocated(By.css(`[data-testid="sidebar-section-${sectionNumber}"]`)),
            5000
        );
        await driver.wait(until.elementIsVisible(section), 5000);
        await section.click();
    } catch (error) {
        console.error(`Error clicking on section ${sectionNumber}:`);
        throw error;
    }
});

When('I add questions to pages of section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    for (let i = 1; i <= 5; i++) {
        // Add textbox 
        try {
            console.log("Attempting to add textbox...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="textbox"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Remember allowed"]'))).click();
            console.log("Textbox added successfully.");
        } catch (error) {
            console.error(`Failed to add textbox on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add choice box
        try {
            console.log("Attempting to add choice box...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="choice"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="choice-1"]'))).sendKeys('1');
            await driver.wait(until.elementLocated(By.css('[data-testid="choice-2"]'))).sendKeys('2');
            await driver.wait(until.elementLocated(By.css('[data-testid="choice-3"]'))).sendKeys('3');
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Remember allowed"]'))).click();
            console.log("Choice box added successfully.");
        } catch (error) {
            console.error(`Failed to add choice box on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add date/time
        try {
            console.log("Attempting to add date/time...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="date-/-time"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Remember allowed"]'))).click();
            console.log("Date/time added successfully.");
        } catch (error) {
            console.error(`Failed to add date/time on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add tag scan
        try {
            console.log("Attempting to add tag scan...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="tag-scan"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            console.log("Tag scan added successfully.");
        } catch (error) {
            console.error(`Failed to add tag scan on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add floorplan
        try {
            console.log("Attempting to add tag scan...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="floorplan"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Remember allowed"]'))).click();
            console.log("floorplan added successfully.");
        } catch (error) {
            console.error(`Failed to add tag scan on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add photo
        try {
            console.log("Attempting to add photo...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="photo"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            console.log("Photo added successfully.");
        } catch (error) {
            console.error(`Failed to add photo on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add video
        try {
            console.log("Attempting to add video...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="video"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Remember allowed"]'))).click();
            console.log("Video added successfully.");
        } catch (error) {
            console.error(`Failed to add video on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add file
        try {
            console.log("Attempting to add file...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="file"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Remember allowed"]'))).click();
            console.log("File added successfully.");
        } catch (error) {
            console.error(`Failed to add file on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add GPS
        try {
            console.log("Attempting to add GPS...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="gps"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Remember allowed"]'))).click();
            console.log("GPS added successfully.");
        } catch (error) {
            console.error(`Failed to add GPS on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add number
        try {
            console.log("Attempting to add number...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="number"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Optional"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="Remember allowed"]'))).click();
            console.log("Number added successfully.");
        } catch (error) {
            console.error(`Failed to number scan on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add display
        try {
            console.log("Attempting to add display...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="display"]'))).click();
            await driver.wait(until.elementLocated(By.css('[data-testid="heading-input"]'))).sendKeys('This is a test');
            console.log("Display added successfully.");
        } catch (error) {
            console.error(`Failed to add display on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add signature
        try {
            console.log("Attempting to add signature...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="signature"]'))).click();
            console.log("Signature added successfully.");
        } catch (error) {
            console.error(`Failed to add signature on page ${i} of section ${sectionNumber + 1}:`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Add asset location
        try {
            console.log("Attempting to add asset location...");
            await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-${sectionNumber + 1}-page-${i}"]`)), 5000).click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await driver.wait(until.elementLocated(By.css('[data-testid="asset-location"]'))).click();
            console.log("Asset location added successfully.");
        } catch (error) {
            console.error(`Failed to add asset location on page ${i} of section ${sectionNumber + 1}:`);
        }

        await driver.wait(until.elementLocated(By.css('[data-testid="save"]')), 5000).click();
    }
});
