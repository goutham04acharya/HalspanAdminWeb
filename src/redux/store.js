import { configureStore } from '@reduxjs/toolkit';
import { persistReducer,persistStore } from "redux-persist"
import storage from 'localforage'
import paginationReducer from './paginationSlice'
import fieldSettingParamsSlice from '../Pages/QuestionnaryForm/Components/Fields/fieldSettingParamsSlice';

const persistConfig = {
    key: 'root', // key for the storage
    storage, // storage engine to use
};
const persistedReducer = persistReducer(persistConfig, paginationReducer);

const store = configureStore({
    reducer: {
        paginationConfig:persistedReducer,
        fieldSettingParams:fieldSettingParamsSlice
    },
});

const persistor = persistStore(store);
export { store, persistor };


