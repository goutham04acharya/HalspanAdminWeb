import { configureStore } from '@reduxjs/toolkit';
import { persistReducer,persistStore } from "redux-persist"
import storage from 'localforage'
import paginationReducer from './paginationSlice'

const persistConfig = {
    key: 'root', // key for the storage
    storage, // storage engine to use
};
const persistedReducer = persistReducer(persistConfig, paginationReducer);

const store = configureStore({
    reducer: {
        paginationConfig:persistedReducer,
    },
});

const persistor = persistStore(store);
export { store, persistor };


