const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const { text } = require('express');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I navigate to the questionnaire listing screen', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="questionnaries"]`))).click();
});

When('I search for the recently created questionnaire', async function () {
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    await searchBox.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    await searchBox.sendKeys(global.questionPublicName);
    await new Promise(resolve => setTimeout(resolve, 3000));
});

When('I click the clone button', async function () {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="clone-0"]`))).click();
});

Then('I should see the new duplicated questionnaire created', async function () {
    console.log("Step started: Checking for duplicated questionnaire");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Waiting for search box...");
    let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    console.log("Search box located");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Clearing search box...");
    await searchBox.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Typing in search box: ", global.questionPublicName + " copy1");
    await searchBox.sendKeys(global.questionPublicName + " copy1");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Waiting for first row in table...");

    let publicName;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            let publicNameElement = await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[3]`)), 10000);
            console.log(`Attempt ${attempt}: Checking if element is attached...`);
            publicName = await publicNameElement.getText();
            console.log(`Found public name: ${publicName}`);
            break; // If successful, exit the loop
        } catch (error) {
            console.log(`Attempt ${attempt}: Element was stale, retrying...`);
            if (attempt === 3) throw error; // If all attempts fail, throw error
        }
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Comparing values: ${publicName} === ${global.questionPublicName + " copy1"}`);
    assert.equal(publicName, global.questionPublicName + " copy1");

    console.log("Step completed successfully");
});

Then('I should see exact duplication of the selected version of a questionnaire', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    // let searchBox = await driver.wait(until.elementLocated(By.css('[data-testid="searchBox"]')), 10000);
    // await searchBox.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    // await searchBox.sendKeys(global.questionPublicName, " ", "copy1");
    // await new Promise(resolve => setTimeout(resolve, 3000));
    await driver.wait(until.elementLocated(By.xpath(`//tbody/tr[1]/td[2]/u`)), 10000).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="version-0"]`))).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const actualSectionData = {};
    await driver.wait(until.elementLocated(By.css('.default-sidebar')), 10000);
    let i = 0;
    while (true) {
        try {
            const section = await driver.wait(until.elementLocated(By.css(`[data-testid="sidebar-section-${i}"]`)), 3000);
            const sectionName = await section.getText();
            console.log(`Found Section: ${sectionName}`);
            actualSectionData[sectionName] = [];
            await section.click();

            let k = 0;
            while (true) {
                try {
                    // eslint-disable-next-line max-len
                    const page = await driver.wait(until.elementLocated(By.css(`[data-testid="sidebar-section-${i}-page-${k}"]`)), 3000);
                    const pageName = await page.getText();
                    console.log(`Found Page ${k}: ${pageName}`);
                    actualSectionData[sectionName].push(pageName);
                    k++;
                } catch (error) {
                    console.log(`No more pages found after index ${k - 1} in section ${sectionName}`);
                    break;
                }
            }

            i++;
        } catch (error) {
            console.log(`No more sections found after index ${i - 1}`);
            break;
        }
    }
    console.log('Actual section data:', actualSectionData);
    for (const section in this.sectionData) {
        if (JSON.stringify(actualSectionData[section]) !== JSON.stringify(this.sectionData[section])) {
            // eslint-disable-next-line max-len
            throw new Error(`Data mismatch for ${section}: expected ${JSON.stringify(this.sectionData[section])}, got ${JSON.stringify(actualSectionData[section])}`);
        }
    }

    console.log('All sections match the expected data!');
});