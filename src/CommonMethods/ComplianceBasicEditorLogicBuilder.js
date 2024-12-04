/* eslint-disable indent */
/* eslint-disable complexity */
/* eslint-disable max-len */
export const generateTernaryOperation = (conditions) => {
    let ternaryString = '';
    conditions.forEach((condition) => {
        // Check if there's an 'if' block  
        if (condition.conditions) {
            // Generate the 'if' condition string  
            const ifConditionString = generateConditionString(condition?.conditions);
            // Add the 'if' condition to the ternary string  
            ternaryString += `(${ifConditionString})`;
        }

        // Add the 'then' action to the ternary string  
        if (condition.thenAction) {
            ternaryString += ' ? ' + generateThenActionString(condition.thenAction);
        }

        // Check if there are 'else if' blocks  
        if (condition.elseIfBlocks) {
            // Loop through each 'else if' block  
            condition.elseIfBlocks.forEach((elseIfBlock, index) => {
                // Generate the 'else if' condition string  
                const elseIfConditionString = generateConditionString(elseIfBlock.conditions);
                // Add the 'else if' condition to the ternary string  
                ternaryString += ` : (${elseIfConditionString}) ? `;
                // Add the 'then' action to the ternary string  
                ternaryString += generateThenActionString(elseIfBlock.thenActions[0]);
            });
        }

        // Check if there's an 'else' block  
        if (condition.elseBlock) {
            // Add the 'else' block to the ternary string  
            ternaryString += ` : ${generateElseBlockString(condition.elseBlock)}`;
        }
    });
    console.log(ternaryString, 'ternaryString')
    // Return the complete ternary string  
    return ternaryString;
}

// Helper function to generate a condition string  
function generateConditionString(conditions) {
    // Initialize the condition string  
    let conditionString = '';
    let andConditions = [];
    let orConditions = [];

    // Loop through each condition  
    conditions.forEach((condition, index) => {
        // Get the operator based on the condition logic  
        let operator;
        switch (condition?.condition_logic) {
            case 'includes':
                operator = `.includes('${condition.value}')`;
                break;
            case 'does not include':
                operator = `.includes('${condition.value}') === false`;
                break;
            case 'equals':
                operator = ` === '${condition.value}'`;
                break;
            case 'not equal to':
                operator = ` !== '${condition.value}'`;
                break;
            default:
                throw new Error(`Unsupported condition logic: ${condition?.condition_logic}`);
        }

        // Add the condition to the condition string  
        const conditionStr = `${condition.question_name}${operator}`;
        if (condition.andClicked && !condition.isOr) {
            andConditions.push(conditionStr);
        } else if (condition.orClicked || condition.isOr) {
            if (andConditions.length > 0) {
                orConditions.push(`(${andConditions.join(' && ')})`);
                andConditions = [];
            }
            orConditions.push(conditionStr);
        } else {
            andConditions.push(conditionStr);
        }
    });

    if (andConditions.length > 0) {
        orConditions.push(`(${andConditions.join(' && ')})`);
    }

    conditionString = orConditions.join(' || ');

    // Return the complete condition string  
    return conditionString;
}

// Helper function to generate a 'then' action string  
function generateThenActionString(action) {
    // Initialize the action string  
    let actionString = '';

    // Add the 'then' action to the action string  
    actionString += `(STATUS = '${action.status.toUpperCase()}', REASON = '${action.value}', ACTION.push('${action.action}'), GRADE = '${action.grade}')`;

    // Return the complete action string  
    return actionString;
}

// Helper function to generate an 'else' block string  
function generateElseBlockString(elseBlock) {
    // Initialize the else block string  
    let elseBlockString = '';

    // Add the 'else' block to the else block string  
    elseBlockString += `(STATUS = '${elseBlock.status.toUpperCase()}', REASON = '${elseBlock.value}', ACTION.push('${elseBlock.action}'), GRADE = '${elseBlock.grade}')`;

    // Return the complete else block string  
    return elseBlockString;
}

// Example usage:  
// const conditions = [...]; // Your conditions array  
// console.log(ternaryString);
