// /* eslint-disable max-len */
// import { createSlice } from "@reduxjs/toolkit";
// import { stringify } from "postcss";

// const initialState = {
//     paginationData: {},
//     currentPage: 1
// };

// const PaginationSlice = createSlice({
//     name: 'PaginationConfig',
//     initialState,
//     reducers: {
//         handlePagination: (state, action) => {
//             state.paginationData = action.payload;
//         },
//         handleCurrentPage: (state, action) => {
//             state.currentPage = action.payload;
//         }
//     }
// });

// export const { handlePagination, handleCurrentPage } = PaginationSlice.actions;
// export default PaginationSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    paginationData: {},
    currentPage: 1,
};

const PaginationSlice = createSlice({
    name: 'PaginationConfig',
    initialState,
    reducers: {
        handlePagination: (state, action) => {
            state.paginationData = { ...state.paginationData, ...action.payload };
        },
        handleCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
});

export const { handlePagination, handleCurrentPage } = PaginationSlice.actions;
export default PaginationSlice.reducer;
