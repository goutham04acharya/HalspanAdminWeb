import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    savedData: {},
    currentData: {}
};

// Helper function to process displayType
const processDisplayType = (item, displayType) => {
    // Define a mapping of displayType keys to result properties
    const displayTypeMap = {
        heading: 'heading',
        text: 'text',
        image: 'image',
        url: {
            type: 'urlType',
            value: 'urlValue'
        }
    };

    // Create a result object and populate it based on displayType
    const result = {};

    for (const key in displayTypeMap) {
        if (Object.prototype.hasOwnProperty.call(displayType, key)) {
            const resultKey = displayTypeMap[key];
            // Set the value if available in the item, otherwise use the displayType value
            result[resultKey] = item?.[resultKey] || displayType[key];
        }
    }

    return result;
};


// Helper function to process source
const processSource = (item) => {
    if (item.source === 'fixed_list') {
        return { fixedChoiceArray: item.source_value };
    } else if (item.source === 'lookup') {
        return { lookupOptionChoice: item.source_value };
    }
    return {};
};

const fieldSettingParamsSlice = createSlice({
    name: 'FieldSettingParams',
    initialState,
    reducers: {
        setNewComponent: (state, action) => {
            const { questionId, id, value } = action.payload;

            if (!state.currentData[questionId]) {
                state.currentData[questionId] = {};
            }

            state.currentData[questionId] = {
                ...state.currentData[questionId],
                [id]: value
            };
        },
        addNewFixedChoice: (state, action) => {
            const { questionId } = action.payload;

            if (!state.currentData[questionId]) {
                state.currentData[questionId] = {};
            }
            if (!state.currentData[questionId].fixedChoiceArray) {
                state.currentData[questionId].fixedChoiceArray = [];
            }

            state.currentData[questionId].fixedChoiceArray.push({ id: `C-${uuidv4()}`, value: '' });
        },
        removeFixedChoice: (state, action) => {
            const { questionId, id } = action.payload;

            if (state.currentData[questionId] && state.currentData[questionId].fixedChoiceArray) {
                state.currentData[questionId].fixedChoiceArray = state.currentData[questionId].fixedChoiceArray.filter(
                    item => item.id !== id
                );
            }
        },
        resetFixedChoice: (state, action) => {
            const { questionId } = action.payload;

            if (!state.currentData[questionId]) {
                state.currentData[questionId] = {};
            }

            state.currentData[questionId].fixedChoiceArray = [
                { id: `C-${uuidv4()}`, value: '' },
                { id: `C-${uuidv4()}`, value: '' },
                { id: `C-${uuidv4()}`, value: '' }
            ];
        },
        setFixedChoiceValue: (state, action) => {
            const { questionId, id, value } = action.payload;

            if (state.currentData[questionId] && state.currentData[questionId].fixedChoiceArray) {
                state.currentData[questionId].fixedChoiceArray = state.currentData[questionId].fixedChoiceArray.map(item =>
                    item.id === id ? { ...item, value } : item
                );
            }
        },
        updateFixedChoiceArray: (state, action) => {
            const { questionId, newList } = action.payload;

            if (state.currentData[questionId]) {
                state.currentData[questionId].fixedChoiceArray = newList;
            }
        },
        saveCurrentData: (state) => {
            state.savedData = { ...state.currentData };
        },
        setInitialData: (state, action) => {
            const data = action.payload;

            data.forEach(item => {
                const questionId = item.question_id;
                const displayType = item.display_type || {}; // Ensure displayType is defined

                const customizedData = {
                    componentType: item.component_type,
                    label: item.label,
                    helptext: item.help_text,
                    placeholderContent: item.placeholder_content,
                    defaultContent: item.default_content,
                    type: item.type,
                    format: item.format,
                    min: item.field_range?.min,
                    max: item.field_range?.max,
                    note: item.admin_field_notes,
                    questionnaireId: item.questionnaire_id,
                    lookupOption: item.lookup_id,
                    options: item?.options,
                    postField: item?.postField,
                    preField: item?.preField,
                    ...processDisplayType(item, displayType),
                    ...processSource(item)
                };

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
