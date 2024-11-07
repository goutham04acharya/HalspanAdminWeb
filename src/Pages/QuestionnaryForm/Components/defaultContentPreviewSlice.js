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
            console.log('first')
            const { fieldId, isEditable } = action.payload;
            state.fieldStatus[fieldId] = isEditable;
        },
        resetFields: (state, action) => {
            console.log('i am here ye herereerer')
            state.fieldStatus = {}
        }
    }
});

export const { setFieldEditable, resetFields } = fieldSlice.actions;
export default fieldSlice.reducer;