export function replaceUUIDsWithQuestions(expression, questionWithUuid) {
    // Create a map of UUIDs to questions
    const uuidToQuestion = {};
    for (const [question, uuid] of Object.entries(questionWithUuid)) {
        uuidToQuestion[uuid] = `${question}`; // Wrap question in quotes to maintain string literal in expression
    }

    // Sort UUIDs by length (longest first) to avoid partial replacements
    const uuids = Object.keys(uuidToQuestion).sort((a, b) => b.length - a.length);

    // Replace each UUID with its corresponding question
    let modifiedExpression = expression;
    for (const uuid of uuids) {
        modifiedExpression = modifiedExpression.replaceAll(uuid, uuidToQuestion[uuid]);
    }

    return modifiedExpression;
}