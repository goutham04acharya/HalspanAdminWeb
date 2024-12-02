/* eslint-disable max-len */
export const defaultContentConverter = (conditionalLogic) => {
    if (conditionalLogic !== "") {
        conditionalLogic = conditionalLogic?.replaceAll(/\s&&\s/g, ' and ').replace(/\s\|\|\s/g, ' or ');
        conditionalLogic = conditionalLogic.replaceAll(/\s&&\s/g, ' AND ').replace(/\s\|\|\s/g, ' OR ');
        conditionalLogic = conditionalLogic.replaceAll(/\s&&\s/g, ' And ').replace(/\s\|\|\s/g, ' Or ');
        conditionalLogic = conditionalLogic.replaceAll(/\?/g, 'then').replace(/\s:\s/g, ' else ');
        // Replace the : with ' else ' // Replace the ? with ' then '
        conditionalLogic = conditionalLogic?.replace(/^ /, 'if '); // Replace the : with ' else ' // Replace the ? with ' then '
        conditionalLogic = conditionalLogic.replace(/sections\./g, '') // Replace the : with ' else ' // Replace the ? with ' then '
        conditionalLogic = conditionalLogic.replace(/\slength\s/g, '()') // Replace the : with ' else ' // Replace the ? with ' then '
        conditionalLogic = conditionalLogic
        // .replace(/then \(/g, 'then {')           // Replace `then (` with `then {`
            // .replace(/then\s*\(([^)]*)\)/g, 'then { $1 }')                    // Replace closing `)` with `}`
            .replace(/ACTIONS\.push\('([^']+)'\)/g, 'ACTIONS += "$1"')
            .replace(
                /(\w+\.\w+\.\w+)\.AddDays\((\d+)\)/g,
                'new Date(new Date($1).setDate(new Date($1).getDate() + $2)).toLocaleDateString("en-GB")'
            )
            .replace(
                /(\w+\.\w+\.\w+)\.SubtractDays\((\d+)\)/g,
                'new Date(new Date($1).setDate(new Date($1).getDate() - $2)).toLocaleDateString("en-GB")'
            )
            // .replace(/^ /, 'if ')
            .replace(/\belse\s{2}/g, 'else if ')
        return conditionalLogic;
    } else {
        return
    }
}