const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until, Key } = require('selenium-webdriver');
const assert = require('assert');

// Helper function to perform double-click
async function doubleClick(driver, element) {
    await driver.actions({ bridge: true })
        .doubleClick(element)
        .perform();
}

When('I double click the section {int} name', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const sectionElement = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-name"]`)));
    await doubleClick(driver, sectionElement);
});

When('I enter the section {int} name', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const sectionElement = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-name"]`)));
    await sectionElement.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    this.sectionName = await sectionElement.sendKeys(`New Section ${sectionNumber}`);
});

When('I double click the page {int} name', async function (pageNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const pageElement = await driver.wait(until.elementLocated(By.css(`[data-testid="page-${pageNumber}-name"]`)));
    await doubleClick(driver, pageElement);
});

When('I enter the page {int} name', async function (pageNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const pageElement = await driver.wait(until.elementLocated(By.css(`[data-testid="page-${pageNumber}-name"]`)));
    await pageElement.sendKeys(Key.chord(Key.CONTROL, 'a', Key.DELETE));
    this.pageName = await pageElement.sendKeys(`New Page ${pageNumber}`);
});

Then('I should see the updated section {int} name on the sidebar', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const sectionName = await driver.wait(until.elementLocated(By.css(`[data-testid="sidebar-section-${sectionNumber}"]`)));
    assert.equal(sectionName, this.sectionName);
});

Then('I should see the updated page {int} name on the sidebar', async function (pageNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const pageName = await driver.wait(until.elementLocated(By.css(`[data-testid="sidebar-page-${pageNumber}"]`)));
    assert.equal(pageName, this.pageName);
});

When('I click on add new section {int} times', async function (times) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const addSectionButton = await driver.wait(until.elementLocated(By.css('[data-testid="add-section"]')));
    for (let i = 0; i < times; i++) {
        await addSectionButton.click();
    }
});

Then('I should see sections created', async function () {
    await new Promise(resolve => setTimeout(resolve, 750));
    let sectionNumber = 1;
    while (true) {
        try {
            // eslint-disable-next-line max-len
            const sectionElement = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-name"]`)), 5000);
            await driver.wait(until.elementIsVisible(sectionElement));
            sectionNumber++;
        } catch (error) {
            break;
        }
    }

    if (sectionNumber === 1) {
        throw new Error('No new sections were created');
    } else {
        console.log(`${sectionNumber - 1} sections were successfully created and validated.`);
    }
});

When('I click the section {int} from sidebar', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const sectionElement = await driver.wait(until.elementLocated(By.css(`[data-testid="sidebar-section-${sectionNumber}"]`)));
    await sectionElement.click();
});

Then('I should see the section {int} highlighted', async function (sectionNumber) {
    await new Promise(resolve => setTimeout(resolve, 750));
    const sectionElement = await driver.wait(until.elementLocated(By.css(`[data-testid="section-${sectionNumber}-name"]`)));
    const isHighlighted = await sectionElement.getAttribute('class').then(classes => classes.includes('highlighted'));
    if (!isHighlighted) {
        throw new Error(`Section ${sectionNumber} is not highlighted`);
    }
});
