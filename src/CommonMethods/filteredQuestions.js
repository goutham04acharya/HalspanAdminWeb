export function getFilteredQuestions(data, filterKey, filterValue) {
    let result = [];
    data.sections.forEach((section) => {
        section.pages.forEach((page) => {
            page.questions.forEach((question) => {
                if (question[filterKey] === filterValue) {
                    let formattedName = `${section.section_name
                        .replace(/\s+/g, "_")}
                        .${page.page_name.replace(/\s+/g, "_")}
                            .${question.question_name.replace(/\s+/g, "_")}`;
                    result.push(formattedName);
                }
            });
        });
    });
    return result;
}