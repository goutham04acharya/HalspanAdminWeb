/* eslint-disable no-undef */
const { AfterAll, BeforeAll, AfterStep, setDefaultTimeout } = require('@cucumber/cucumber');
const chrome = require('selenium-webdriver/chrome');
const { By, until } = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const { faker } = require('@faker-js/faker');
const { createCoverageMap } = require('istanbul-lib-coverage');
const fs = require('fs');
const path = require('path');
const service = new chrome.ServiceBuilder(chromedriver.path).build();
const options = new chrome.Options();
options.addArguments('--disable-dev-shm-usage');
options.addArguments('--no-sandbox');
options.addArguments('--disable-features=VizDisplayCompositor');
options.addArguments('enable-automation');
options.addArguments('--disable-dev-shm-usage');
// options.addArguments('--headless'); // comment this line of code to run in local chrome browser
options.addArguments('--window-size=1920,1080');
options.addArguments('--disable-gpu');
options.addArguments('--disable-extensions');
options.addArguments('--dns-prefetch-disable');
options.addArguments('enable-features=NetworkServiceInProcess');
setDefaultTimeout(10000);

global.driver = chrome.Driver.createSession(options, service);

BeforeAll(async function () {
    await driver.manage();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await driver.get('http://localhost:3000/');
    await driver.wait(until.elementLocated(By.css('body')));
    global.current_process_name = faker.string.alpha({ count: 10, casing: 'upper' });
    global.is_user_logged_in = false;
    console.log('Current process name:', global.current_process_name);
    try {
        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes('localhost:3000')) {
            global.__coverage__ = await driver.executeScript('return __coverage__;');
            global.coverageMap = createCoverageMap(__coverage__);
        } else {
            console.log('Skipping coverage tracking for external URL.');
        }
    } catch (error) {
        throw new Error('::: __coverage__ ::: Coverage Mapping Object Not Found :::');
    }
});

AfterAll(async function () {
    const coverageDataDir = path.join(__dirname, 'coverageData');
    if (!fs.existsSync(coverageDataDir)) {
        fs.mkdirSync(coverageDataDir);
    }
    const coverageDataFile = path.join(coverageDataDir, `coverage_${global.current_process_name}.json`);
    if (global.coverageMap) {
        const coverageData = global.coverageMap.toJSON();
        // Write coverage data to file
        fs.writeFile(coverageDataFile, JSON.stringify(coverageData), (err) => {
            if (err) {
                console.error('Error writing coverage data:', err);
            } else {
                console.log('Coverage data has been written to:', coverageDataFile);
            }
        });
    }
    await driver.quit();
});

AfterStep(async function () {
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('localhost:3000')) {
        const updatedCoverageData = await driver.executeScript('return __coverage__;');
        const updatedCoverageMap = createCoverageMap(updatedCoverageData);
        try{
            global.coverageMap.merge(updatedCoverageMap);
        }
        catch{
            console.log("merge error found");
        }
    }
});
