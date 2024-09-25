/* eslint-disable max-len */
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    allSectionDetails: []
};

// Helper function to check if the section already exists
const isUniqueSection = (sections, newSection) => {
    return !sections.some(section => section.section_id === newSection.section_id);
};

// Helper function to check if the page already exists within a section
const isUniquePage = (pages, newPage) => {
    return !pages.some(page => page.page_id === newPage.page_id);
};

// Helper function to check if the question already exists within a page
const isUniqueQuestion = (questions, newQuestion) => {
    return !questions.some(question => question.question_id === newQuestion.question_id);
};

// Create a slice for managing selected questions
const allSectionDetailsSlice = createSlice({
    name: 'allsectiondetails',
    initialState,
    reducers: {
        setUniqueAllSectionDetails: (state, action) => {
            const newSection = action.payload;

            // Check if the section already exists
            if (isUniqueSection(state.allSectionDetails, newSection)) {
                state.allSectionDetails.push(newSection);
            } else {
                // Find the existing section
                const existingSection = state.allSectionDetails.find(
                    section => section.section_id === newSection.section_id
                );

                // Check if the page already exists
                newSection.pages.forEach(newPage => {
                    if (isUniquePage(existingSection.pages, newPage)) {
                        existingSection.pages.push(newPage);
                    } else {
                        // Find the existing page
                        const existingPage = existingSection.pages.find(
                            page => page.page_id === newPage.page_id
                        );

                        // Check if the question already exists
                        newPage.questions.forEach(newQuestion => {
                            if (isUniqueQuestion(existingPage.questions, newQuestion)) {
                                existingPage.questions.push(newQuestion);
                            }
                        });
                    }
                });
            }
        },
    }
});


// Export the actions
export const {
    setUniqueAllSectionDetails,
} = allSectionDetailsSlice.actions;

export default allSectionDetailsSlice.reducer;