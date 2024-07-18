import { readFileSync, writeFileSync } from 'fs';

// Read the package.json file
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

// Extract the license and description information
const packageInfo = {};
for (const dependency in packageJson.dependencies) {
    const depPackageJson = JSON.parse(readFileSync(`node_modules/${dependency}/package.json`, 'utf8'));
    packageInfo[`${dependency}@${packageJson.dependencies[dependency]}`] = {
        license: depPackageJson.license,
        description: depPackageJson.description
    };
}

writeFileSync('licenses.json', JSON.stringify(packageInfo, null, 2));
