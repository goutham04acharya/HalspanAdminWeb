/* eslint-disable complexity */
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    savedData: {},
    currentData: {},
    editorToggle: {},
    conditions: [],
    currentQuestionLabel: {}
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

    const result = {};

    for (const key in displayTypeMap) {
        if (Object.prototype.hasOwnProperty.call(displayType, key)) {
            const resultKey = displayTypeMap[key];

            // If key is 'url', handle it as an object with type and value
            if (key === 'url' && typeof displayType[key] === 'object') {
                result.urlType = displayType[key].type || item.urlType;
                result.urlValue = displayType[key].value || item.urlValue;
            } else if (typeof resultKey === 'string') {
                result[resultKey] = item?.[resultKey] || displayType[key];
            }
        }
    }

    return result;
};

// Helper function to process source
const processSource = (item) => {
    if (item.source === 'fixedList') {
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
        setComplianceLogicCondition: (state, action) => {
            state.conditions = action.payload;
        },
        clearConditions: (state) => {
            state.conditions = [];
        },
        setNewLogic: (state, action) => {
            const { questionId, id, value } = action.payload;

            if (!state.editorToggle[questionId]) {
                state.editorToggle[questionId] = {};
            }

            const newValue = Array.isArray(value)
                ? value.map((item) => ({ ...item }))
                : { ...value };

            state.editorToggle[questionId] = {
                ...state.editorToggle[questionId],
                [id]: newValue
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
        setCurrentData: (state,action) => {
            state.currentData =  action.payload;
        },
        setInitialData: (state, action) => {
            const data = action.payload;

            data.forEach(item => {
                const questionId = item.question_id;
                const displayType = item.display_type || {}; // Ensure displayType is defined
                const customizedData = {
                    componentType: item.component_type,
                    label: item.label,
                    helptext: item?.help_text,
                    placeholderContent: item.placeholder_content,
                    default_content: item.default_content,
                    type: item.type,
                    format: item.format || '24',
                    regular_expression: item?.regular_expression,
                    format_error: item?.format_error,
                    min: item.field_range?.min,
                    max: item.field_range?.max,
                    admin_field_notes: item.admin_field_notes,
                    questionnaireId: item.questionnaire_id,
                    lookupOption: item.lookup_id,
                    lookupValue: item.lookup_value,
                    lookupList: item.lookup_list,
                    options: item?.options,
                    postField: item?.postField,
                    preField: item?.preField,
                    source: item?.source,
                    source_value: item?.source_value,
                    draw_image: item?.asset_extras?.draw_image,
                    pin_drop: item?.asset_extras?.pin_drop,
                    include_metadata: item?.asset_extras?.include_metadata,
                    fileSize: item?.asset_extras?.file_size,
                    fileType: item?.asset_extras?.file_type,
                    conditional_logic: item?.conditional_logic,
                    default_conditional_logic: item?.default_conditional_logic,
                    service_record_lfp: item?.service_record_lfp,
                    attribute_data_lfp: item?.attribute_data_lfp,
                    questionnaire_name_lfp: item?.questionnaire_name_lfp,
                    question_name_lfp: item?.question_name_lfp,
                    question_id_lfp: item?.question_id_lfp,
                    ...processDisplayType(item, displayType),
                    ...processSource(item)
                };

                state.currentData[questionId] = customizedData;
                state.savedData[questionId] = customizedData;
            });
        },
        setcurrentQuestionLabel: (state, action) => {
            state.currentQuestionLabel = {}
            const { id, label } = action.payload
            state.currentQuestionLabel[id] = label;
        },

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
    setNewLogic,
    addNewFixedChoice,
    removeFixedChoice,
    resetFixedChoice,
    setFixedChoiceValue,
    updateFixedChoiceArray,
    saveCurrentData,
    setInitialData,
    setComplianceLogicCondition,
    clearConditions,
    setcurrentQuestionLabel,
    setCurrentData
} = fieldSettingParamsSlice.actions;

export default fieldSettingParamsSlice.reducer;
