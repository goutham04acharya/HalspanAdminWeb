import { configureStore, createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    allSectionDetails : []
};

// Create a slice for managing selected questions
const allSectionDetailsSlice = createSlice({
    name: 'allSectiondetails',
    initialState,
    reducers: {
        setAllSectionDetails: (state, action) => {
            state.allSectionDetails = action.payload;
        },
    }})

// Export the actions
export const {
    setAllSectionDetails,
}= allSectionDetailsSlice.actions;

export default allSectionDetailsSlice.reducer;