export const findSectionAndPageName = (section, questionId) => {
    // Iterate through pages in the object
    for (const page of section?.pages) {
        // Iterate through questions in the page
        for (const question of page?.questions) {
            if (question?.question_id === questionId) {
                // Return section name and page name with spaces replaced by underscores
                return {
                    section_name: section?.section_name.replace(/\s+/g, '_'),
                    page_name: page?.page_name.replace(/\s+/g, '_'),
                    label: question?.label.replace(/\s+/g, '_')
                };
            }
        }
    }
    // Return null if question ID is not found
    return null;
}

export const getQuestionDataById = (sections, questionId, data) => {
    // Iterate through each section
    for (const section of sections) {
        // Iterate through each page in the section
        for (const page of section.pages) {
            // Iterate through each question on the page
            for (const question of page.questions) {
                // Check if this is the question we're looking for
                if (question.question_id === questionId) {
                    return question[data] ?? null;
                }
            }
        }
    }
    return null;
}