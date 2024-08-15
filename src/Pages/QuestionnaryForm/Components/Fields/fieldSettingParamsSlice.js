import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const fieldSettingParamsSlice = createSlice({
    name: 'FieldSettingParams',
    initialState,
    reducers: {
        setNewComponent: (state, action) => {
            const { payload } = action;
            const { questionId, id, value } = payload;
            console.log(payload, 'payload');

            // Ensure that the questionId exists in the state
            if (!state[questionId]) {
                state[questionId] = {};
            }

            // Update or add the new property while preserving existing properties
            state[questionId] = {
                ...state[questionId],
                [id]: value
            };
        }
    }
});

export const { setNewComponent } = fieldSettingParamsSlice.actions;
export default fieldSettingParamsSlice.reducer;
