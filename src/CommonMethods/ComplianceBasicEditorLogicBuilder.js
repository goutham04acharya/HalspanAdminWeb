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

    console.log(ternaryString, 'ternaryString');
    return ternaryString;
};

function generateConditionString(conditions) {
    let conditionString = '';
    let tempConditions = [];
    let isAndGroup = false;

    conditions.forEach((condition, index) => {
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
    return `(STATUS = '${action.status.toUpperCase()}', REASON = '${action.value}', ACTION.push('${action.action}'), GRADE = '${action.grade}')`;
}

export function generateElseBlockString(elseBlock) {
    return `(STATUS = '${elseBlock.status.toUpperCase()}', REASON = '${elseBlock.value}', ACTION.push('${elseBlock.action}'), GRADE = '${elseBlock.grade}')`;
}
