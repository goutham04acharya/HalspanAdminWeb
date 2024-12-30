/* eslint-disable max-len */

export default function parseExpression(expression) {
    const parsedResult = [];

    // Normalize the operators for consistency
    expression = expression.replace(/\s+and\s+/g, ' and ').replace(/\s+or\s+/g, ' or ');

    // Regular expression to match if, else if, and else blocks
    const ifElseRegex = /if\s*\((.*?)\)\s*then\s*\((.*?)\)(?:\s*else if\s*\((.*?)\)\s*then\s*\((.*?)\))*\s*else\s*\((.*?)\)/g;
    const matches = [...expression.matchAll(ifElseRegex)];

    if (matches.length === 0) return [];

    matches.forEach(match => {
        const ifConditions = match[1]; // Conditions inside the if
        const thenActions = match[2]; // Actions for if
        const elseIfConditions = match[3] ? match[3].split('else if (').map(c => c.replace(/\) then.*/, '')) : [];
        const elseIfActions = match[4] ? match[4].split('else if (').map(c => c.replace(/.*?then \(|\)$/g, '')) : [];
        const elseActions = match[5]; // Actions for else

        // Parse the "if" block
        const ifBlock = {
            conditions: parseConditions(ifConditions),
            thenAction: parseActions(thenActions),
            elseIfBlocks: [],
            elseBlock: parseActions(elseActions)
        };

        // Parse the "else if" blocks
        elseIfConditions.forEach((conditions, index) => {
            ifBlock.elseIfBlocks.push({
                type: 'elseif',
                conditions: parseConditions(conditions),
                thenActions: parseActions(elseIfActions[index])
            });
        });

        parsedResult.push(ifBlock);
    });

    return parsedResult;
}

/**
 * Parses conditions from the condition string into structured objects.
 *
 * @param {string} conditionString - The condition string (e.g., Section_1.Page_1.Question_1.includes("44") and ...)
 * @returns {Array} - An array of condition objects.
 */
function parseConditions(conditionString) {
    const conditionRegex = /([\w.]+)\s*(includes|does not include|equals|not equals to|smaller|larger|smaller or equal|larger or equal|has no files|has atleast one file|number of file is|date is before today|date is after or equal to today|date is before or equal to today|date is after today|date is “X” date of set date)\s*\(?\"?(.*?)\"?\)?/g;
    const conditions = [];
    let match;

    while ((match = conditionRegex.exec(conditionString)) !== null) {
        conditions.push({
            question_name: match[1],
            condition_logic: match[2],
            value: match[3],
            condition_type: inferConditionType(match[1]),
            dropdown: false,
            condition_dropdown: false,
            index: conditions.length,
            andClicked: conditionString.includes(' and '),
            orClicked: conditionString.includes(' or '),
            isOr: conditionString.includes(' or '),
            undefined: false,
            value_dropdown: false
        });
    }
    return conditions;
}

/**
 * Infers the condition type based on the name of the question.
 * This can be expanded for better accuracy if needed.
 *
 * @param {string} questionName - The name of the question (e.g., Section_1.Page_1.Question_1)
 * @returns {string} - The inferred condition type.
 */
function inferConditionType(questionName) {
    if (questionName.includes('Choice')) return 'choiceboxfield';
    return 'textboxfield';
}

/**
 * Parses action strings into structured action objects.
 *
 * @param {string} actionString - The action string (e.g., STATUS = 'PASS', GRADE = '1')
 * @returns {Object} - The parsed actions.
 */
function parseActions(actionString) {
    const actionRegex = /(STATUS|GRADE|REASON|ACTIONS)\s*=\s*['"](.*?)['"]/g;
    const actions = {};
    let match;

    while ((match = actionRegex.exec(actionString)) !== null) {
        const key = match[1].toLowerCase();
        actions[key] = match[2];
    }

    return actions;
}