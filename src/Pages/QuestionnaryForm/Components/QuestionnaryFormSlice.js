
// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    selectedAddQuestion: '',
    selectedQuestionId: ''
};

// Create a slice for managing selected questions
const questionnaryFormSlice = createSlice({
    name: 'questionnaryForm',
    initialState,
    reducers: {
        setSelectedAddQuestion: (state, action) => {
            state.selectedAddQuestion = action.payload;
        },
        setSelectedQuestionId: (state, action) => {
            state.selectedQuestionId = action.payload;
        }
    }
});

// Export the actions
export const { setSelectedAddQuestion, setSelectedQuestionId } = questionnaryFormSlice.actions;
