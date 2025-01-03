# Testing Documentation

This document provides an overview of the testing framework, folder structure, scripts, and key components used in our testing setup.

---

## Folder Structure

The project contains the following testing folder structure:

```
test
├── bdd_api
│   └── index.js
├── bdd_getbearertoken
│   └── token.js
├── bdd_payload
│   └── payload.js
├── integration-testing
│   ├── Flow1
│   │   ├── sample.feature
│   │   └── cucumber.js
│   └── Flow2
│       ├── sample.feature
│       └── cucumber.js
├── step-definations
│   ├── admin
│   │   ├── sample.js
│   ├── coverageData
│   │   ├── coverage_A.json
│   ├── Driver.js
│   └── failed_scenarios
│       ├── <scenario-id>_Sample
├── support
│   ├── 600.csv
└── unit-testing
    ├── unit-testing1
    │   ├── sample.feature
    └── unit-testing2
        ├── sample.feature
```

### Key Folders and Files

- **bdd\_api**: Contains API integration functions.
- **bdd\_getbearertoken**: Handles token generation for authentication.
- **bdd\_payload**: Contains payload configurations for API testing.
- **integration-testing**: Contains feature files and configurations for integration testing.
- **step-definations**: Holds step definition files, including utility files and failed scenario logs.
- **support**: Contains support files and data for testing.
- **unit-testing**: Contains unit test feature files.

---

## Scripts

### Running Unit Testing

To execute unit testing, the script `bdd_unit_testing_azure.js` is used. This script handles:

- Discovery of `.feature` files in the `unit-testing` folder.
- Parallel execution of up to 5 feature files.
- Delay mechanisms for test queue management.

### Running Integration Testing

The script `integration_testing.js` is used for running integration tests. It:

- Filters out irrelevant folders from the `integration-testing` directory.
- Runs tests in parallel with a maximum of 10 concurrent executions.
- Manages test queue and retry mechanisms for robustness.

### Running Individual Feature Files

You can run dry run using:

```bash
npm run bdd_dry_run
```

You can run an individual feature file using:

```bash
npm run cucumber <relative path of feature file>
```

### Running the Pipeline Locally

To run the pipeline locally:

```bash
pm2 kill
npm run build
pm2 start scripts/server.js
node scripts/bdd_unit_testing_azure.js
node scripts/integration_testing.js
```

---

## Driver Configuration

The `Driver.js` file sets up the global Selenium WebDriver with Chrome options for executing tests. Key configurations include:

- Headless and non-headless execution options.
- Setting a window size of 1920x1080.
- Disabling unnecessary features for performance optimization.

### Key Features of `Driver.js`

- Initializes WebDriver before all tests.
- Configures default timeouts to 34 seconds.
- Utilizes `faker.js` for generating test data.

Example snippet:

```javascript
const options = new chrome.Options();
options.addArguments('--disable-dev-shm-usage');
options.addArguments('--no-sandbox');
options.addArguments('--window-size=1920,1080');

global.driver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

BeforeAll(async function () {
    await driver.get('https://questionnaire-qa.halspantest.com/');
    console.log('Test setup complete.');
});
```

---

## Additional Notes

1. **Parallel Execution**: Both unit and integration testing scripts support parallel execution for faster results.
2. **Test Reports**:
   - JSON and JUnit reports are generated for all tests in the `./reports` and `./reports-xml` directories.
3. **Retry Mechanism**: The framework retries failed tests once to ensure reliability.
4. **Error Handling**: Scripts include error handling to exit gracefully in case of issues.

---

## How to Contribute

1. Add new `.feature` files to the appropriate directory.
2. Update or create step definitions in `step-definations`.
3. Ensure all dependencies are installed by running:
   ```bash
   npm install
   ```
4. Run tests locally using the scripts provided.

---

## Dependencies

Ensure the following dependencies are installed:

- `@cucumber/cucumber`
- `selenium-webdriver`
- `faker`
- `istanbul-lib-coverage`

---

For further details or issues, please reach out to the QA team.