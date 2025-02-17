/* eslint-disable complexity */
/* eslint-disable max-len */
export const defaultContentConverter = (conditionalLogic) => {
    
    if (conditionalLogic !== "") {
        conditionalLogic = conditionalLogic?.replaceAll(/\s&&\s/g, ' and ')?.replace(/\s\|\|\s/g, ' or ');
        conditionalLogic = conditionalLogic?.replaceAll(/\s&&\s/g, ' AND ')?.replace(/\s\|\|\s/g, ' OR ');
        conditionalLogic = conditionalLogic?.replaceAll(/\s&&\s/g, ' And ')?.replace(/\s\|\|\s/g, ' Or ');
        conditionalLogic = conditionalLogic?.replaceAll(/\s\?\s/g, ' then ').replace(/\s:\s/g, ' else ');
        conditionalLogic = conditionalLogic?.replaceAll(/""/g, '"');
        // Replace the : with ' else ' // Replace the ? with ' then '
        conditionalLogic = conditionalLogic?.replace(/^ /, 'if '); // Replace the : with ' else ' // Replace the ? with ' then '
        conditionalLogic = conditionalLogic?.replace(/sections\./g, '') // Replace the : with ' else ' // Replace the ? with ' then '
        conditionalLogic = conditionalLogic?.replace(/\slength\s/g, '()') // Replace the : with ' else ' // Replace the ? with ' then '
        conditionalLogic = conditionalLogic
            ?.replace(
                /new Date\(new Date\((\w+\.\w+\.\w+)\)\.setDate\(new Date\(\1\)\.getDate\(\) \+ (\d+)\)\)\.toLocaleDateString\("en-GB"\)/g,
                '$1.AddDays($2)'
            )
            ?.replace(
                /new Date\(new Date\((\w+\.\w+\.\w+)\)\.setDate\(new Date\(\1\)\.getDate\(\) - (\d+)\)\)\.toLocaleDateString\("en-GB"\)/g,
                '$1.SubtractDays($2)'
            );

        return conditionalLogic;

    } else {
        return
    }
}