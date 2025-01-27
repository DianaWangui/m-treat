import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import { injectStore } from './axiosInterceptor';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

injectStore(store);