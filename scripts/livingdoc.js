const { Console } = require('console');
const fs = require('fs');
const report = require("multiple-cucumber-html-reporter");

(async () => {
    // const originalString = process.env.BITBUCKET_REPO_FULL_NAME
    // console.log(originalString,'repo full name')
    // const modifiedString = originalString.split("/")[1]; 
    // console.log(modifiedString,'modified string')
    // Read the contents of the execution_times.txt file
    report.generate({
        jsonDir: "reports/",
        reportPath: "living-documentation/",
        pageTitle: "Halspan Admin Web Application",
        pageFooter: `<div class="created-by"><p>Halspan Admin Web ApplicationDocumentation</p></div>`,
        reportName: "Halspan Admin Web Application",
        metadata: {
            browser: {
                name: "chrome",
                version: "60",
            },
            device: "Local test machine",
            platform: {
                name: "ubuntu",
                version: "16.04",
            },
        },
        customData: {
            title: "Run info",
            data: [
                { label: "Project", value: "Halspan Admin Web Application" },
            ],
        },
    });

})();