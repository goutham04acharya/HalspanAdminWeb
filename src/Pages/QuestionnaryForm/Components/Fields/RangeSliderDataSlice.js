import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rangeData: {
        startValue : 0,
        endValue : 100
    },
};

const RangeDataSlice = createSlice({
    name: 'RaangeDataConfig',
    initialState,
    reducers: {
        handleRangeSlider: (state, action) => {
            state.endValue = { ...state.endValue, ...action.payload };
        }
    },
});

export const { handleRangeSlider } = RangeDataSlice.actions;
export default RangeDataSlice.reducer;