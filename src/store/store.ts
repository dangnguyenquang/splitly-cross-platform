import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import authSlice from './authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appSlice from './appSlice';
import groupSlice from './groupSlice';
// Kết hợp các reducers
const rootReducer = combineReducers({
    auth: authSlice,
    app: appSlice,
    group: groupSlice,
});

// Cấu hình redux-persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'app', 'group']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store với configureStore
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra tuần tự hóa
    }),
});

// Tạo persistor
const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
