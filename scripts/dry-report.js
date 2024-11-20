const reporter = require('cucumber-html-reporter')

const options = {
    theme: 'bootstrap',
    jsonDir: 'reports',
    output: 'reports/1.1.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    brandTitle: 'Halspan',
    columnLayout: 1
}

reporter.generate(options)
