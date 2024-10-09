// Function to handle logic transformation
export const buildLogicExpression = (question_name, condition_logic, value) => {
    switch (condition_logic) {
    case 'equals':
        return `${question_name} === '${value}'`;
    case 'not equals to':
        return `${question_name} !== '${value}'`;
    case 'includes':
        return `${question_name}.includes('${value}')`;
    case 'does not include':
        return `!${question_name}.includes('${value}')`;
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
            return `(${buildLogicExpression(question_name, condition_logic, value)})`;
        });

        // Join expressions with " && " and wrap the entire expression in parentheses
        return `(${expressions.join(' && ')})`;
    }).join(' || ');  // Separate each group with " OR "
};