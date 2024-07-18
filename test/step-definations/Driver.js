/* eslint-disable no-undef */
const { AfterAll, BeforeAll, AfterStep } = require('@cucumber/cucumber')
const chrome = require('selenium-webdriver/chrome')
const { By, until } = require('selenium-webdriver')
const chromedriver = require('chromedriver')
const { faker } = require('@faker-js/faker')
const { createCoverageMap } = require('istanbul-lib-coverage')
const fs = require('fs')
const path = require('path')
const service = new chrome.ServiceBuilder(chromedriver.path).build()
const options = new chrome.Options()
options.addArguments('--disable-dev-shm-usage')
options.addArguments('--no-sandbox')
options.addArguments('--disable-features=VizDisplayCompositor')
options.addArguments('enable-automation')
options.addArguments('--disable-dev-shm-usage')
options.addArguments('--headless') // comment this line of code to run in local chrome browser
options.addArguments('--window-size=1920,1080')
options.addArguments('--disable-gpu')
options.addArguments('--disable-extensions')
options.addArguments('--dns-prefetch-disable')
options.addArguments('enable-features=NetworkServiceInProcess')

global.driver = chrome.Driver.createSession(options, service)

BeforeAll(async function () {
    await driver.manage()
    await new Promise(resolve => setTimeout(resolve, 3000))
    await driver.get('http://localhost:3000/')
    await driver.wait(until.elementLocated(By.id('root')))
    global.current_process_name = faker.string.alpha({ count: 10, casing: 'upper' })
    global.is_user_logged_in = false
    console.log('Current process name:', global.current_process_name)
    try {
        global.__coverage__ = await driver.executeScript('return __coverage__;')
        global.coverageMap = createCoverageMap(__coverage__)
    } catch (error) {
        throw new Error('::: __coverage__ ::: Coverage Mapping Object Not Found :::')
    }
})

AfterAll(async function () {
    const coverageDataDir = path.join(__dirname, 'coverageData')
    if (!fs.existsSync(coverageDataDir)) {
        fs.mkdirSync(coverageDataDir)
    }
    const coverageDataFile = path.join(coverageDataDir, `coverage_${global.current_process_name}.json`)
    const coverageData = global.coverageMap.toJSON()
    // Write coverage data to file
    fs.writeFile(coverageDataFile, JSON.stringify(coverageData), (err) => {
        if (err) {
            console.error('Error writing coverage data:', err)
        } else {
            console.log('Coverage data has been written to:', coverageDataFile)
        }
    })
    await driver.quit()
})
AfterStep(async function () {
    const updatedCoverageData = await driver.executeScript('return __coverage__;')
    const updatedCoverageMap = createCoverageMap(updatedCoverageData)
    global.coverageMap.merge(updatedCoverageMap)
})
