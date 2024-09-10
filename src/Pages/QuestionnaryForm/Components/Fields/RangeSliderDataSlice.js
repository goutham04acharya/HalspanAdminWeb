// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     rangeData: {
//         startValue : 0,
//         endValue : 100
//     },
// };

// const RangeDataSlice = createSlice({
//     name: 'RaangeDataConfig',
//     initialState,
//     reducers: {
//         handleRangeSlider: (state, action) => {
//             state.endValue = { ...state.endValue, ...action.payload };
//         }
//     },
// });

// export const { handleRangeSlider } = RangeDataSlice.actions;
// export default RangeDataSlice.reducer;

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
