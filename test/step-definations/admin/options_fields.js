const {When } = require('@cucumber/cucumber');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By

When('I toggle the options {string}',async function (option) {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementsLocated(By.css(`[data-testid = "${option}"]`)));
    await driver.wait(until.elementsLocated(By.css(`[data-testid = "${option}"]`)));
});

When('I click on add question', async function(){
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementsLocated(By.css(`[data-testid ="add-question-0"]`)));
});

// When('I click on question section 1', async function(){
//     await new Promise(resolve => setTimeout(resolve, 750));
//     await driver.wait(until.elementsLocated(By.css(`[data-testid ="question-sec"]`)));
// })