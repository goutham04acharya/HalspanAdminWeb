import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    savedData: {},
    currentData: {}
};

const fieldSettingParamsSlice = createSlice({
    name: 'FieldSettingParams',
    initialState,
    reducers: {
        setNewComponent: (state, action) => {
            const { questionId, id, value } = action.payload;

            console.log(questionId);
            // Ensure that the questionId exists in the currentData
            if (!state.currentData?.[questionId]) {
                state.currentData[questionId] = {};
            }

            // Update or add the new property while preserving existing properties
            state.currentData[questionId] = {
                ...state.currentData[questionId],
                [id]: value
            };
        },
        addNewFixedChoice: (state, action) => {
            const { questionId } = action.payload;

            // Ensure that the questionId exists and fixedChoiceArray is initialized
            if (!state.currentData?.[questionId]) {
                state.currentData[questionId] = {};
            }
            if (!state.currentData?.[questionId]?.fixedChoiceArray) {
                state.currentData[questionId].fixedChoiceArray = [];
            }

            state.currentData[questionId].fixedChoiceArray.push({ id: `C-${uuidv4()}`, value: '' });
        },
        removeFixedChoice: (state, action) => {
            const { questionId, id } = action.payload;

            if (state?.currentData[questionId] && state?.currentData?.[questionId]?.fixedChoiceArray) {
                state.currentData[questionId].fixedChoiceArray = state.currentData[questionId].fixedChoiceArray.filter(
                    item => item.id !== id
                );
            }
        },
        resetFixedChoice: (state, action) => {
            const { questionId } = action.payload;

            if (!state?.currentData?.[questionId]) {
                state.currentData[questionId] = {};
            }

            // Reset fixedChoiceArray to a new array with three empty items
            state.currentData[questionId].fixedChoiceArray = [
                { id: `C-${uuidv4()}`, value: '' },
                { id: `C-${uuidv4()}`, value: '' },
                { id: `C-${uuidv4()}`, value: '' }
            ];
        },
        setFixedChoiceValue: (state, action) => {
            const { questionId, id, value } = action.payload;

            if (state.currentData?.[questionId] && state.currentData?.[questionId]?.fixedChoiceArray) {
                // Find the item with the matching id and update its value
                state.currentData[questionId].fixedChoiceArray = state.currentData[questionId].fixedChoiceArray.map(item =>
                    item.id === id ? { ...item, value } : item
                );
            }
        },
        // Update the entire fixedChoiceArray
        updateFixedChoiceArray: (state, action) => {
            const { questionId, newList } = action.payload;

            if (state.currentData?.[questionId]) {
                state.currentData[questionId].fixedChoiceArray = newList;
            }
        },
        // Function to update savedData with currentData
        saveCurrentData: (state) => {
            state.savedData = { ...state.currentData };
        }
    }
});


// Utility function to compare currentData with savedData
export const compareData = (currentData, savedData) => {
    // Helper function to filter out `componentType` from an object
    const filterComponentType = (obj) => {
        const { componentType, ...rest } = obj;
        return rest;
    };

    // Iterate through the currentData and compare with savedData
    for (const key in currentData) {
        if (currentData.hasOwnProperty(key)) {
            const filteredCurrentData = filterComponentType(currentData[key]);
            const filteredSavedData = filterComponentType(savedData[key] || {});

            // Compare the filtered objects
            if (JSON.stringify(filteredCurrentData) !== JSON.stringify(filteredSavedData)) {
                return false; // Data is not the same
            }
        }
    }

    return true; // All relevant data is the same
};

export const {
    setNewComponent,
    addNewFixedChoice,
    removeFixedChoice,
    resetFixedChoice,
    setFixedChoiceValue,
    updateFixedChoiceArray,
    saveCurrentData
} = fieldSettingParamsSlice.actions;

export default fieldSettingParamsSlice.reducer;
