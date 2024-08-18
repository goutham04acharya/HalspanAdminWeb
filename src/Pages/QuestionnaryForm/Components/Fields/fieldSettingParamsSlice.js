import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {};

const fieldSettingParamsSlice = createSlice({
    name: 'FieldSettingParams',
    initialState,
    reducers: {
        setNewComponent: (state, action) => {
            const { questionId, id, value } = action.payload;

            // Ensure that the questionId exists in the state
            if (!state[questionId]) {
                state[questionId] = {};
            }

            // Update or add the new property while preserving existing properties
            state[questionId] = {
                ...state[questionId],
                [id]: value
            };
        },
        addNewFixedChoice: (state, action) => {
            const { questionId } = action.payload;

            state[questionId].fixedChoiceArray.push({ id: `C-${uuidv4()}`, value: '' });
        },
        removeFixedChoice: (state, action) => {
            const { questionId, id } = action.payload;

            if (state[questionId]) {
                state[questionId].fixedChoiceArray = state[questionId].fixedChoiceArray.filter(
                    item => item.id !== id
                );
            }
        },
        resetFixedChoice: (state, action) => {
            const { questionId } = action.payload;

            if (state[questionId]) {
                // Reset fixedChoiceArray to a new array with three empty items
                state[questionId].fixedChoiceArray = [
                    { id: `C-${uuidv4()}`, value: '' },
                    { id: `C-${uuidv4()}`, value: '' },
                    { id: `C-${uuidv4()}`, value: '' }
                ];
            }
        },
        setFixedChoiceValue: (state, action) => {
            const { questionId, id, value } = action.payload;

            if (state[questionId]) {
                // Find the item with the matching id and update its value
                state[questionId].fixedChoiceArray = state[questionId].fixedChoiceArray.map(item =>
                    item.id === id ? { ...item, value } : item
                );
            }
        },
        // Update the entire fixedChoiceArray
        updateFixedChoiceArray: (state, action) => {
            const { questionId, newList } = action.payload;

            if (state[questionId]) {
                state[questionId].fixedChoiceArray = newList;
            }
        }
    }
});

export const { setNewComponent,
    addNewFixedChoice,
    removeFixedChoice,
    resetFixedChoice,
    setFixedChoiceValue,
    updateFixedChoiceArray } = fieldSettingParamsSlice.actions;
export default fieldSettingParamsSlice.reducer;
