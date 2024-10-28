export const defaultContentConverter = (conditionalLogic) => {
    console.log(conditionalLogic,'logic before')
    conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' and ').replace(/\s\|\|\s/g, ' or ');
    conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' AND ').replace(/\s\|\|\s/g, ' OR ');
    conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' And ').replace(/\s\|\|\s/g, ' Or ');
    conditionalLogic = conditionalLogic.replace(/\?/g, 'then').replace(/\s:\s/g, ' else '); 
    // Replace the : with ' else ' // Replace the ? with ' then '
    conditionalLogic = conditionalLogic.replace(/^ /, 'if '); // Replace the : with ' else ' // Replace the ? with ' then '
    conditionalLogic = conditionalLogic.replace(/sections\./g, '') // Replace the : with ' else ' // Replace the ? with ' then '
    conditionalLogic = conditionalLogic.replace(/\slength\s/g, '()') // Replace the : with ' else ' // Replace the ? with ' then '
    console.log(conditionalLogic,'after ')
    return conditionalLogic;
}