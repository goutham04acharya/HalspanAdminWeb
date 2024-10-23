// signatureSlice.js
import { createSlice } from '@reduxjs/toolkit';

const signatureSlice = createSlice({
    name: 'signatures',
    initialState: {
        signatures: {} // Store signatures keyed by canvas ID
    },
    reducers: {
        addSignature: (state, action) => {
            const { id, signature } = action.payload;
            state.signatures[id] = signature; // Store signature with unique ID
        },
        clearSignature: (state, action) => {
            const { id } = action.payload;
            delete state.signatures[id];
        },
        clearAllSignatures: (state) => {
            state.signatures = {};
        }
    }
});

export const { addSignature, clearSignature, clearAllSignatures } = signatureSlice.actions;
export default signatureSlice.reducer;
