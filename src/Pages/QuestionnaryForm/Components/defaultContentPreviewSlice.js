// fieldSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    fieldStatus: {},  // Stores boolean state for each field
};

const fieldSlice = createSlice({
    name: 'fields',
    initialState,
    reducers: {
        setFieldEditable: (state, action) => {
            const { fieldId, isEditable } = action.payload;
            state.fieldStatus[fieldId] = isEditable;
        },
        resetFields: (state, action) => {
            state.fieldStatus = {}
        }
    }
});

export const { setFieldEditable, resetFields } = fieldSlice.actions;
export default fieldSlice.reducer;