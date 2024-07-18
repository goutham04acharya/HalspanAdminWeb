/* eslint-disable max-len */
const util = require('util');
const fs = require('fs');
const { exec } = require('child_process');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const featureDirectory = 'test/unit-testing';
const DELAY_BETWEEN_TESTS = 1000; // 5 seconds
const DELAY_BETWEEN_PARALLEL_EXECUTIONS = 1000; // 40 seconds
const MAX_PARALLEL_EXECUTIONS = 10;
let COUNTER = 0;

async function getFeatureFiles (directory) {
    let files = await readdir(directory);
    files = await Promise.all(files.map(async file => {
        const fullPath = `${directory}/${file}`;
        const fileStat = await stat(fullPath);
        if (fileStat.isDirectory()) {
            return getFeatureFiles(fullPath);
        } else if (file.endsWith('.feature')) {
            return fullPath;
        }
    }));
    return files.flat();
}

async function runTestQueue () {
    const featureFiles = await getFeatureFiles(featureDirectory);
    console.log(featureFiles);
    const queue = featureFiles.filter(file => file.endsWith('.feature'));

    async function runNextTest (isLogin) {
        const featureFile = queue.shift();
        if (featureFile) {
            try {
                await runTest(featureFile, isLogin);
            } catch (error) {
                console.error('Error occurred during BDD test');
                process.exit(1);
            }

            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_TESTS));
            await runNextTest(false);
        }
    }

    const testPromises = [];
    testPromises.push(runNextTest(true));
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_PARALLEL_EXECUTIONS));

    for (let i = 0; i < MAX_PARALLEL_EXECUTIONS; i++) {
        testPromises.push(runNextTest(false));
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_PARALLEL_EXECUTIONS));
    }

    await Promise.all(testPromises);
    console.log('All BDD tests completed successfully.');
}

async function runTest (featureFile, isLogin) {
    return new Promise((resolve, reject) => {
        COUNTER = COUNTER + 1;
        const command = `./node_modules/@cucumber/cucumber/bin/cucumber.js --import test --retry 1 --force-exit -f json:./reports/test-report.json ${featureFile} --world-parameters '{"login": ${isLogin}}'`;

        console.log('started executing file --', featureFile);

        // eslint-disable-next-line security/detect-child-process
        const child = exec(command, (error) => {
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
