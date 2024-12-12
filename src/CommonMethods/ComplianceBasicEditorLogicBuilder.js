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
            condition.elseIfBlocks.forEach((elseIfBlock) => {
                const elseIfConditionString = generateConditionString(elseIfBlock.conditions);
                ternaryString += ` : (${elseIfConditionString}) ? `;
                ternaryString += generateThenActionString(elseIfBlock.thenActions[0]);
            });
        }

        // Check if there's an 'else' block  
        if (condition.elseBlock) {
            ternaryString += ` : ${generateElseBlockString(condition.elseBlock)}`;
        }
    });
    return ternaryString;
};

function generateConditionString(conditions) {
    let conditionString = '';
    let tempConditions = [];
    let isAndGroup = false;

    conditions.forEach((condition, index) => {
        let operator;
        switch (item.condition_logic) {
            case "includes":
                resultExpression = `${item.question_name}.includes("${item.value}")`;
                break;
            case "equals":
                resultExpression = `${item.question_name} == ${getValue(item.value, item.condition_type)}`;
                break;
            case "not equals to":
                resultExpression = `${item.question_name} != ${getValue(item.value, item.condition_type)}`;
                break;
            case "does not include":
                resultExpression = `!${item.question_name}.includes("${item.value}")`;
                break;
            case "smaller":
                resultExpression = `${item.question_name} < ${getValue(item.value, item.condition_type)}`;
                break;
            case "larger":
                resultExpression = `${item.question_name} > ${getValue(item.value, item.condition_type)}`;
                break;
            case "smaller or equal":
                resultExpression = `${item.question_name} <= ${getValue(item.value, item.condition_type)}`;
                break;
            case "larger or equal":
                resultExpression = `${item.question_name} >= ${getValue(item.value, item.condition_type)}`;
                break;
            case "has no files":
                resultExpression = `${item.question_name}.length == 0`;
                break;
            case "has atleast one file":
                resultExpression = `${item.question_name}.length > 0`;
                break;
            case "number of file is":
                resultExpression = `${item.question_name}.length == ${getValue(item.value, item.condition_type)}`;
                break;
            case "date is before today":
                resultExpression = `${item.question_name} < new Date()`;
                break;
            case "date is after or equal to today":
                resultExpression = `${item.question_name} >= new Date()`;
                break;
            case "date is before or equal to today":
                resultExpression = `${item.question_name} <= new Date()`;
                break;
            case "date is after today":
                resultExpression = `${item.question_name} > new Date()`;
                break;
            case "date is “X” date of set date":
                resultExpression = `Math.abs(${item.question_name} - new Date(${item.date})) == ${item.value}`;
                break;
            default:
                // Handle unknown condition logic  
                console.error(`Unknown condition logic: ${item.condition_logic}`);
                break;
        }


        const conditionStr = `${condition.question_name}${operator}`;
        if (condition.andClicked === true) {
            tempConditions.push(conditionStr);
            isAndGroup = true;
        } else if (condition.orClicked || condition.isOr) {
            if (isAndGroup) {
                conditionString += `(${tempConditions.join(' && ')}) || `;
                tempConditions = [];
                isAndGroup = false;
            }
            conditionString += `${conditionStr} || `;
        } else {
            if (isAndGroup) {
                tempConditions.push(conditionStr);
            } else {
                conditionString += `${conditionStr} ${conditions[index + 1].andClicked ? '&& ' : '|| '}`;
            }
        }
    });

    if (isAndGroup) {
        conditionString += `(${tempConditions.join(' && ')})`;
    } else {
        conditionString = conditionString.slice(0, -4); // Remove trailing ' && ' or ' || '
    }

    return conditionString.trim();
}

export function generateThenActionString(action) {
    const status = action.status.toUpperCase();
    let actionString = `(STATUS = '${status}'`;

    if (status === 'PASS') {
        // If status is PASS, only GRADE should be present
        if (action.grade !== undefined) {
            actionString += `, GRADE = '${action.grade}'`;
        }
    } else if (status === 'FAIL') {
        // If status is FAIL, REASON and ACTION should be present
        if (action.value !== undefined) {
            actionString += `, REASON = '${action.value}'`;
        }
        if (action.action !== undefined) {
            actionString += `, ACTIONS.push('${action.action}')`;
        }
    }

    actionString += ')';
    return actionString;
}

export function generateElseBlockString(elseBlock) {
    const status = elseBlock.status.toUpperCase();
    let elseBlockString = `(STATUS = '${status}'`;

    if (status === 'PASS') {
        // If status is PASS, only GRADE should be present
        if (elseBlock.grade !== undefined) {
            elseBlockString += `, GRADE = '${elseBlock.grade}'`;
        }
    } else if (status === 'FAIL') {
        // If status is FAIL, REASON and ACTION should be present
        if (elseBlock.value !== undefined) {
            elseBlockString += `, REASON = '${elseBlock.value}'`;
        }
        if (elseBlock.action !== undefined) {
            elseBlockString += `, ACTIONS.push('${elseBlock.action}')`;
        }
    }

    elseBlockString += ')';
    return elseBlockString;
}

