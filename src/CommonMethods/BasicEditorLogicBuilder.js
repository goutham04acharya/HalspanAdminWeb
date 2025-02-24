/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable complexity */

import { formatDate, reverseFormat, reversingFormat } from "./FormatDate";

let isMultiChoice = false;
// Function to handle logic transformation
export const buildLogicExpression = (question_name, condition_logic, value, date, isMultiChoice) => {
    switch (condition_logic) {
        case 'equals':
            return `${question_name} == "${isMultiChoice ? value.toString() : value}"`;
        case 'not equal to':
            return `${question_name} !== "${isMultiChoice ? value.toString() : value}"`;
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
        case 'date is before today':
            return `${question_name} < new Date()`;
        case 'date is before or equal to today':
            return `${question_name} <= new Date()`;
        case 'date is after today':
            return `${question_name} > new Date()`;
        case 'date is after or equal to today':
            return `${question_name} >= new Date()`;
        case 'date is “X” date of set date':
            const formatteDate = formatDate(date);
            const actualFormat = reverseFormat(formatteDate)
            return `formatDateWithOffset('${formatteDate}', ${value}, ${question_name})`
        // return `isSameDate(${question_name}, ${formatteDate}, ${value})`
        // return `Math.abs(${question_name} - ${actualFormat} ) == ${value / 24 * 60 * 60 * 1000}`
        default:
            // Fallback for other logic (you can add more cases here if needed)
            return '';
    }
};

// Main function to build the overall condition expression
export const buildConditionExpression = (conditionsArray, combinedArray) => {
    return conditionsArray?.map((conditionGroup) => {
        const expressions = conditionGroup.conditions.map((cond) => {
            const { question_name, condition_logic, value, date } = cond;
            const matchedQuestion = combinedArray.find(q => q.question_detail === question_name);
            if (matchedQuestion && matchedQuestion.type === 'multi_choice') {
                isMultiChoice = true;
            }
            // Use the buildLogicExpression function for each condition
            return `${buildLogicExpression(question_name, condition_logic, value, date, isMultiChoice)}`;
        });

        // Join expressions with " && " and wrap the entire expression in parentheses
        return `${expressions.join(' && ')}`;
    }).join(' || ');  // Separate each group with " OR "
};