
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
    showquestionDeleteModal: '',
    showCancelModal: false,
    showPageDeleteModal: '',
    isModalOpen: '',
    complianceLogicId:0,
    assetType: {asset_type: ''},  
    selectedServiceValue: '' ,
    selectedQuesOption: null,
    selectedQuestionnaryOption: null
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
        },
        setShowquestionDeleteModal: (state, action) => {  
            state.showquestionDeleteModal = action.payload; 
        },
        setShowPageDeleteModal: (state, action) => {
            state.showPageDeleteModal = action.payload;
        },
        setModalOpen: (state, action) => {
            state.isModalOpen = action.payload;
        },
        setComplianceLogicId: (state, action) => {
            state.complianceLogicId = action.payload;
        },
        setShowCancelModal: (state, action) => {
            state.showCancelModal = action.payload;
        },
        setAssetType: (state, action) => {
            state.assetType = action.payload
        },
        setSelectedServiceValue: (state, action) => {
            state.selectedServiceValue = action.payload
        },
        setSelectedQuesOption: (state, action) => {
            state.selectedQuesOption = action.payload
        },
        setSelectedQuestionnaryOption: (state, action) => {
            state.selectedQuestionnaryOption = action.payload
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
    setShowquestionDeleteModal,
    setShowPageDeleteModal,
    setModalOpen,
    setComplianceLogicId,
    setShowCancelModal,
    setAssetType,
    setSelectedServiceValue,
    setSelectedQuesOption,
    setSelectedQuestionnaryOption,
    selectedQuestionnaryOption,
} = questionnaryFormSlice.actions;

export default questionnaryFormSlice.reducer;

