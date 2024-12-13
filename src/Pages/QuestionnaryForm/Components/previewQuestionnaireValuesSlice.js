import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    questions: {} // { question_id: value }
};

const questionsSlice = createSlice({
    name: 'questionValues',
    initialState,
    reducers: {
        setQuestionValue: (state, action) => {
            const { question_id, value } = action.payload;
            console.log(action.payload, 'action')
            state.questions[question_id] = value;
        },
        removeQuestionValue: (state, action) => {
            const { question_id } = action.payload;
            delete state.questions[question_id];
        },
        clearQuestions: (state) => {
            state.questions = {};
        },
    },
});

// Export the actions to be used in components
export const { setQuestionValue, removeQuestionValue, clearQuestions } = questionsSlice.actions;

// Export the reducer to be used in the store configuration
export default questionsSlice.reducer;
