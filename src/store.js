import { configureStore } from "@reduxjs/toolkit";
import unitReducer from './features/unit/unitSlice'
import machineCategoryReducer from './features/machineCategory/machineCategorySlice'
import enumReducer from './features/enum/enumSlice'
import machineReducer from './features/machine/machineSlice'
import machineRequestReducer from './features/machineRequest/machineRequestSlice'

const store = configureStore({
    reducer: {
        unit: unitReducer,
        machineCategory: machineCategoryReducer,
        machine: machineReducer,
        enum: enumReducer,
        machineRequest: machineRequestReducer,
    },
});

export default store;

