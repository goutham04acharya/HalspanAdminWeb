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
        },
        setInitialData: (state, action) => {
            const data = action.payload;
        
            data.forEach(item => {
                const questionId = item.question_id;
        
                // Initialize the customizedData object
                const customizedData = {
                    componentType: item.component_type,
                    label: item.label,
                    helptext: item.help_text,
                    placeholderContent: item.placeholder_content,
                    defaultContent: item.default_content,
                    type: item.type,
                    format: item.format,
                    numberOfCharacters: {
                        min: item.number_of_characters?.min,
                        max: item.number_of_characters?.max,
                    },
                    note: item.admin_field_notes,
                    questionnaireId: item.questionnaire_id,
                    lookupOption: item.lookup_id,
                };
                
                // Handle the source object and assign values based on the key
                if (item.source) {
                    const sourceKey = Object.keys(item.source)[0];  // Get the first key in the source object

                    if (sourceKey === 'fixed_list') {
                        customizedData.source = 'fixedList'
                        customizedData.fixedChoiceArray = item.source[sourceKey];
                    } else if (sourceKey === 'lookup') {
                        customizedData.source = sourceKey
                        customizedData.lookupOptionChoice = item.source[sourceKey];
                    }
                }
        
                // Store in both currentData and savedData
                state.currentData[questionId] = customizedData;
                state.savedData[questionId] = customizedData;
            });
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
    saveCurrentData,
    setInitialData
} = fieldSettingParamsSlice.actions;

export default fieldSettingParamsSlice.reducer;
