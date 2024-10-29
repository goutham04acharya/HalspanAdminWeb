import { configureStore } from '@reduxjs/toolkit';
import { persistReducer,persistStore } from "redux-persist"
import storage from 'localforage'
import paginationReducer from './paginationSlice'
import fieldSettingParamsSlice from '../Pages/QuestionnaryForm/Components/Fields/fieldSettingParamsSlice';
import sliderSlice from '../Pages/QuestionnaryForm/Components/Fields/RangeSliderDataSlice';
import questionnaryFormSlice from '../Pages/QuestionnaryForm/Components/QuestionnaryFormSlice';
import allSectionDetailsSlice from '../Pages/QuestionnaryForm/Components/ConditionalLogicAdvanced/Components/SectionDetailsSlice'
import signatureSlice from '../Pages/QuestionnaryForm/Components/Fields/Signature/signatureSlice';

const persistConfig = {
    key: 'root', // key for the storage
    storage, // storage engine to use
};
const persistedReducer = persistReducer(persistConfig, paginationReducer);

const store = configureStore({
    reducer: {
        paginationConfig:persistedReducer,
        fieldSettingParams:fieldSettingParamsSlice,
        sliderConfig: sliderSlice,  // Your slider reducer
        questionnaryForm: questionnaryFormSlice, // Add the question reducer to the store
        allsectiondetails: allSectionDetailsSlice,
        signature: signatureSlice,
    },
});

const persistor = persistStore(store);
export { store, persistor };


