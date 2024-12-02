const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const webdriver = require("selenium-webdriver");
const until = require('selenium-webdriver').until
const path = require('path');
const By = require('selenium-webdriver').By
const Keys = webdriver.Key;

When('I click the add conditional logic button for page {int}', async function (pageNumber) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-condition-page-${pageNumber}"]`))).click();
});

Then('I should see the advanced editor for page', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="advance-editor-tab"]`))).click();
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Shows when..."]')));
});

When('I enter the conditional logic for page', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('I should see the updated condition logic button for page {int}', async function (pageNumber) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-added-page-${pageNumber}"]`))).click();
});

Then('I should not see the page {int} at section {int}', async function (int, int2) {
    // Then('I should not see the page {int} at section {float}', function (int, float) {
    // Then('I should not see the page {float} at section {int}', function (float, int) {
    // Then('I should not see the page {float} at section {float}', function (float, float2) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('I should see the page {int} at section {int}', async function (int, int2) {
    // Then('I should see the page {int} at section {float}', function (int, float) {
    // Then('I should see the page {float} at section {int}', function (float, int) {
    // Then('I should see the page {float} at section {float}', function (float, float2) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I click the add conditional logic button for section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-condition-page-${sectionNumber}"]`))).click();
});

Then('I should see the advanced editor for section', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="advance-editor-tab"]`))).click();
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Shows when..."]')));
});

When('I enter the conditional logic for section', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('I should see the updated condition logic button for section {int}', async function (sectionNumber) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="condition-added-page-${sectionNumber}"]`))).click();
});

Then('I should not see the section {int}', async function (int) {
    // Then('I should not see the section {float}', function (float) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});