/* eslint-disable no-undef */
const { AfterAll, BeforeAll, AfterStep, setDefaultTimeout, Before, After } = require('@cucumber/cucumber');
const chrome = require('selenium-webdriver/chrome');
const { By, until } = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const { faker } = require('@faker-js/faker');
const { createCoverageMap } = require('istanbul-lib-coverage');
const fs = require('fs');
const path = require('path');
const { createQuestionnaire } = require('../bdd_api/index');
const {create_questionnaire_payload} = require('../bdd_payload/payload')

const service = new chrome.ServiceBuilder(chromedriver.path).build();
const options = new chrome.Options();
options.addArguments('--disable-dev-shm-usage');
options.addArguments('--no-sandbox');
options.addArguments('--disable-features=VizDisplayCompositor');
options.addArguments('enable-automation');
options.addArguments('--disable-dev-shm-usage');
options.addArguments('--headless'); // comment this line of code to run in local chrome browser
options.addArguments('--window-size=1920,1080');
options.addArguments('--disable-gpu');
options.addArguments('--disable-extensions');
options.addArguments('--dns-prefetch-disable');
options.addArguments('enable-features=NetworkServiceInProcess');
setDefaultTimeout(34000);

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

let loginPerformed = false

Before('@login', async function () {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (!loginPerformed) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await driver.wait(until.elementLocated(By.id('username'))).sendKeys('nayana.sk@7edge.com');
        await driver.wait(until.elementLocated(By.id('password'))).sendKeys('Auth@123');
        await new Promise((resolve) => setTimeout(resolve, 750));
        await driver.wait(until.elementLocated(By.css('button[type="submit"]'))).click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        loginPerformed = true;
    }
});
AfterAll(async function () {
    const coverageDataDir = path.join(__dirname, 'coverageData');
    if (!fs.existsSync(coverageDataDir)) {
        fs.mkdirSync(coverageDataDir);
    }

    const coverageDataFile = path.join(coverageDataDir, `coverage_${global.current_process_name}.json`);

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
    try {
        if (currentUrl.includes('localhost:3000')) {
            const updatedCoverageData = await driver.executeScript('return __coverage__;');
            const updatedCoverageMap = createCoverageMap(updatedCoverageData);

            // Debug log to check if global.coverageMap is defined
            if (!global.coverageMap) {
                // console.log('global.coverageMap is not defined. Initializing...');
                global.coverageMap = createCoverageMap({});
            }

            global.coverageMap.merge(updatedCoverageMap);
        }
    } catch (err) {
        console.log(`error: ${err}`);
    }
});
After(function (scenario) {
    console.log('scenario.result.status',scenario.result.status)
    let failed_scenarios = path.join(__dirname, 'failed_scenarios');
    if (!fs.existsSync(failed_scenarios)) {
        fs.mkdirSync(failed_scenarios);
    }
    if (scenario.result.status === 'FAILED') {
        var world = this;
        return driver.takeScreenshot().then(function(screenShot, error) {
            if (!error) {
                world.attach(screenShot, "image/png");
                // eslint-disable-next-line max-len
                failed_scenarios = path.join(failed_scenarios,`${scenario.pickle.id}_${scenario.pickle.name.replaceAll('/', '_')}.png`)
                fs.writeFile(failed_scenarios, screenShot, 'base64', (err) => {
                    if (err) {
                        console.error('Error writing coverage data:', err);
                    } else {
                        console.log('Coverage data has been written to:', failed_scenarios);
                    }
                });
            }
        });
    }
});

Before("@create_questionnaire", async function () {
    try {
        global.questionary_payload= await create_questionnaire_payload();
        console.log(global.questionary_payload, "Questionary Payload")
        let response = await createQuestionnaire(global.questionary_payload)
        console.log(response, "Questionary Response")
    } catch (err) {
        console.log(err)
    }
});