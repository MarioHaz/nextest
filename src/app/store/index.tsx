import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import favorites from "./likeSlice";

interface RootState {
  favorites: ReturnType<typeof favorites>;
}

const persistConfig: PersistConfig<RootState> = {
  key: "root", // key to store in localStorage
  storage, // define storage type
  whitelist: ["favorites"],
};

// Combine reducers
const rootReducer = combineReducers({
  favorites,
});

// Create the persisted reducer
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create the persistor to be used in the PersistGate
export const persistor = persistStore(store);

// Export types for use in  app
export type AppDispatch = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;
