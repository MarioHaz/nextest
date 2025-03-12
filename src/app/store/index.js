import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import favorites from "./likeSlice";

// Configuration for redux-persist
const persistConfig = {
  key: "root", // key to store in localStorage
  storage, // define storage type
  whitelist: ["favorites"],
};

// Combine your reducers
const rootReducer = combineReducers({
  favorites,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist actions
    }),
});

// Create the persistor to be used in the PersistGate
export const persistor = persistStore(store);
