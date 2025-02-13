const assert = require('assert');
const { Given, When, Then, But } = require('@cucumber/cucumber')
const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until
const By = require('selenium-webdriver').By
const Key = webdriver.Key

When('I click the duplicate button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="duplicate"]`))).click();
});

Then('I should see a confirmation modal to select the version', async function () {
    await new Promise((resolve) => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Select Version"]')));
});

When('I select the version of the questionnaire', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="Version"]`))).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css(`[data-testid="Version-1"]`))).click();
});

When('I click the confirm duplicate button', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    await driver.wait(until.elementLocated(By.css(`[data-testid="confirm-duplicate"]`))).click();
});

// Then('I should see the new version created', async function () {
//     // Find all versions again by using the data-testid attribute
//     const versionDivs = await driver.findElements(By.css('[data-testid="version-"]'));
//     const n = versionDivs.length;
//     let versionsAfter = [];

//     // Loop through each version div and store its text
//     for (let i = 0; i < n; i++) {
//         const versionNumber = await versionDivs[i].getText();
//         versionsAfter.push(versionNumber);
//     }

//     versionsAfter.sort();

//     // Filter to find new versions
//     const newVersions = versionsAfter.filter(version => !global.versionsBefore.includes(version));
    
//     if (newVersions.length === 1) {
//         console.log('New version added:', newVersions[0]);
//     } else if (newVersions.length === 0) {
//         throw new Error('No new version was added.');
//     } else {
//         throw new Error('Multiple new versions were found.');
//     }

//     console.log('Versions after duplication:', versionsAfter);
// });

Then('I should see the new version created', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    const versionName = await driver.wait(until.elementLocated(By.css(`[data-testid="version-0"]`))).getText();
    assert.equal(versionName, 'Version 2')
});

When('I save all the data inside the version about to be duplicated', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));

    await driver.wait(until.elementLocated(By.css(`[data-testid="version-0"]`))).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css(`[data-testid="add-question-btn-section-1-page-1"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="textbox"]`))).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await driver.wait(until.elementLocated(By.css('[data-testid="add-section"]'))).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await driver.wait(until.elementLocated(By.css('[data-testid="add-page-sec-0"]'))).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    // await driver.wait(until.elementLocated(By.css(`[data-testid="save-btn-0"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="save"]`))).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    // await driver.wait(until.elementLocated(By.css(`[data-testid="save-btn-1"]`))).click();
    await driver.wait(until.elementLocated(By.css(`[data-testid="save"]`))).click();
    console.log('pass 1');

    await driver.wait(until.elementLocated(By.css('.default-sidebar')), 10000);
    console.log('pass 2');

    let i = 0;
    this.sectionData = {};
    while (true) {
        try {
            const section = await driver.wait(until.elementLocated(By.css(`[data-testid="sidebar-section-${i}"]`)), 3000);
            const sectionName = await section.getText();
            console.log(`Section ${i}: ${sectionName}`);
            this.sectionData[sectionName] = [];
            await section.click();
            i++;
        } catch (error) {
            console.log(`No more sections found after index ${i - 1}`);
            break;
        }
    }

    console.log('All sections:', Object.keys(this.sectionData));
    for (let i = 0; i < Object.keys(this.sectionData).length; i++) {
        const sectionName = Object.keys(this.sectionData)[i];
        console.log(`Processing ${sectionName}`);

        let k = 0;

        await driver.wait(until.elementLocated(By.css(`[data-testid="sidebar-section-${i}"]`)), 3000).click();
        while (true) {
            try {
                // eslint-disable-next-line max-len
                const page = await driver.wait(until.elementLocated(By.css(`[data-testid="sidebar-section-${i}-page-${k}"]`)), 3000);
                const pageName = await page.getText();
                console.log(`Page ${k}: ${pageName}`);
                this.sectionData[sectionName].push(pageName);
                k++;
            } catch (error) {
                console.log(`No more pages found after index ${k - 1} in section ${sectionName}`);
                break;
            }
        }
    }

    console.log('Final section data:', this.sectionData);
    await driver.navigate().back();
});

Then('I should see exact duplication of the selected version', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
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
    await driver.navigate().back();
});