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
            }
            // If the section already exists, we don't add it (no else block needed)
        },
    }
});


// Export the actions
export const {
    setUniqueAllSectionDetails,
} = allSectionDetailsSlice.actions;

export default allSectionDetailsSlice.reducer;