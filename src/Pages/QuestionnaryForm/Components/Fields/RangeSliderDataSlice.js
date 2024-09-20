

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sliderValue: 0,
    incrementBy: 1
};

const sliderSlice = createSlice({
    name: 'slider',
    initialState,
    reducers: {
        handleSliderValue: (state, action) => {
            state.sliderValue = action.payload.sliderValue;
        },
        setIncrementBy: (state, action) => {
            state.incrementBy = action.payload.incrementBy;
        }
    },
});

export const { handleSliderValue, setIncrementBy } = sliderSlice.actions;
export default sliderSlice.reducer;
