/* eslint-disable complexity */
// Function to handle logic transformation
export const buildLogicExpression = (question_name, condition_logic, value) => {
    switch (condition_logic) {
    case 'equals':
        return `${question_name} === "${value}"`;
    case 'not equal to':
        return `${question_name} !== "${value}"`;
    case 'includes':
        return `${question_name}.includes("${value}")`;
    case 'does not include':
        return `!${question_name}.includes("${value}")`;
    case 'smaller':
        return `${question_name} < ${value}`;
    case 'larger':
        return `${question_name} > ${value}`;
    case 'smaller or equal':
        return `${question_name} <= ${value}`;
    case 'larger or equal':
        return `${question_name} >= ${value}`;
    case 'has no files':
        return `${question_name}.length === 0`;
    case 'has atleast one file':
        return `${question_name}.length >= 1`;
    case 'number of file is':
        return `${question_name}.length === ${value}`;
    default:
        // Fallback for other logic (you can add more cases here if needed)
        return `${question_name} ${condition_logic} '${value}'`;
    }
};

// Main function to build the overall condition expression
export const buildConditionExpression = (conditionsArray) => {
    return conditionsArray.map((conditionGroup) => {
        const expressions = conditionGroup.conditions.map((cond) => {
            const { question_name, condition_logic, value } = cond;

            // Use the buildLogicExpression function for each condition
            return `${buildLogicExpression(question_name, condition_logic, value)}`;
        });

        // Join expressions with " && " and wrap the entire expression in parentheses
        return `${expressions.join(' && ')}`;
    }).join(' || ');  // Separate each group with " OR "
};