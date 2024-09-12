
// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

// Initial state
const initialState = {
    selectedAddQuestion: '',
    selectedQuestionId: '',
    shouldAutoSave: '',
    selectedSectionData: {},
    dataIsSame: {},
    formDefaultInfo: [],
    savedSection: [],
    selectedComponent: null,
    sectionToDelete: null,
    pageToDelete: { sectionIndex: null, pageIndex: null },
    questionToDelete: { sectionIndex: null, pageIndex: null, questionIndex: null },


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
        },
        setShouldAutoSave: (state, action) => {
            state.shouldAutoSave = action.payload
        },
        setSelectedSectionData: (state, action) => {
            state.selectedSectionData = action?.payload
        },
        setDataIsSame: (state, action) => {
            state.dataIsSame = action?.payload
        },
        setFormDefaultInfo: (state, action) => {
            state.formDefaultInfo = action?.payload
        },
        setSavedSection: (state, action) => {
            state.savedSection = action?.payload
        },
        setSelectedComponent: (state, action) => {
            state.selectedComponent = action?.payload
        },
        setSectionToDelete: (state, action) => {
            state.sectionToDelete = action?.payload
        },
        setPageToDelete: (state, action) => {  
            state.pageToDelete = action.payload;
        },
        setQuestionToDelete: (state, action) => {  
            state.questionToDelete = action.payload; 
        }
    }
});

// Export the actions
export const {
    setSelectedAddQuestion,
    setSelectedQuestionId,
    setShouldAutoSave,
    setSelectedSectionData,
    setDataIsSame,
    setFormDefaultInfo,
    setSavedSection,
    setSelectedComponent,
    setPageToDelete,
    setSectionToDelete,
    setQuestionToDelete,
} = questionnaryFormSlice.actions;

export default questionnaryFormSlice.reducer;

