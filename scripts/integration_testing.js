/* eslint-disable max-len */
const util = require('util');
const fs = require('fs');
const { exec } = require('child_process');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const featureDirectory = 'test/integration-testing';
const DELAY_BETWEEN_TESTS = 1000; // 1 second
const DELAY_BETWEEN_PARALLEL_EXECUTIONS = 1000; // 1 second
const MAX_PARALLEL_EXECUTIONS = 10;
let COUNTER = 0;

const excludedFolders = ['step-definations', 'support', 'bdd_api', 'bdd_getbearertoken', 'bdd_payload', 'bdd_modules', 'unit-testing', 'unit-testing1', 'unit-testing2', 'unit-testing3', 'unit-testing4'];

async function getFeatureFiles(directory) {
    let files = await readdir(directory);
    files = await Promise.all(files.map(async file => {
        const fullPath = `${directory}/${file}`;
        const fileStat = await stat(fullPath);
        if (fileStat.isDirectory() && !excludedFolders.includes(file)) {
            return fullPath;
        }
    }));
    return files.filter(Boolean); // Remove undefined values
}

async function runTestQueue() {
    const featureFiles = await getFeatureFiles(featureDirectory);
    console.log(featureFiles);
    const queue = featureFiles.slice(); // Clone the array

    async function runNextTest(isInitial) {
        const featureFile = queue.shift();

        if (!featureFile) {
            if (queue.length === 0 && !isInitial) {
                // If queue is empty and this is not the initial call, resolve immediately
                return;
            }
            // Otherwise, delay and try again
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_TESTS));
            return runNextTest(false);
        }

        try {
            await runTest(featureFile);
        } catch (error) {
            console.error('Error occurred during BDD test');
            process.exit(1);
        }

        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_TESTS));
        await runNextTest(false);
    }

    const testPromises = [];
    testPromises.push(runNextTest(true));
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_PARALLEL_EXECUTIONS));

    for (let i = 0; i < MAX_PARALLEL_EXECUTIONS - 1; i++) {
        testPromises.push(runNextTest(false));
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_PARALLEL_EXECUTIONS));
    }

    await Promise.all(testPromises);
    console.log('All BDD tests completed successfully.');
}

async function runTest(featureFile) {
    return new Promise((resolve, reject) => {
        COUNTER = COUNTER + 1;
        const file = featureFile.split('/').pop().split('.').slice(0, -1).join('.');
        const command = `./node_modules/@cucumber/cucumber/bin/cucumber.js --force-exit -f json:./reports/test-report-${featureFile}.json -f junit:./reports-xml/TEST-test-report-unit-test-${file}.xml --config ${featureFile}/cucumber.js`;

        console.log('started executing file --', featureFile);

        // eslint-disable-next-line security/detect-child-process
        const child = exec(command, { maxBuffer: 5 * 1024 * 1024 }, (error) => {
            if (error) {
                console.log(`Error Executing BDD tests for ${featureFile} ${error}`);
                reject(error);
            } else {
                console.log(`BDD tests for ${featureFile} completed successfully`);
                resolve();
            }
        });

        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    });
}

runTestQueue().catch(error => {
    console.error(`Error occurred during BDD tests: ${error}`);
    process.exit(1);
});
