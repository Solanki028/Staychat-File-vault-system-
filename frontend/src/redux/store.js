import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bankReducer from './slices/bankSlice';
import companyReducer from './slices/companySlice';
import documentReducer from './slices/documentSlice';
import employeeReducer from './slices/employeeSlice';
import partnerReducer from './slices/partnerSlice';
import vehicleReducer from './slices/vehicleSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bank: bankReducer,
    companies: companyReducer,
    documents: documentReducer,
    employees: employeeReducer,
    partners: partnerReducer,
    vehicles: vehicleReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
