/* eslint-disable no-undef */
const { Given, Then } = require('@cucumber/cucumber')
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By

Given('I am on welcome screen', async function () {
    // Write code here that turns the phrase above into concrete actions
    await driver.get('http://localhost:3000/')
    await driver.wait(until.elementLocated(By.id('root')))
    return 'passed'
})

Then('i should see Welcome text', function () {
// Write code here that turns the phrase above into concrete actions
    return 'passed'
})
