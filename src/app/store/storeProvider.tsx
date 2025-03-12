"use client";

import React, { JSX, ReactNode } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./index"; // Adjust the import path as needed
import { PersistGate } from "redux-persist/integration/react";

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({
  children,
}: StoreProviderProps): JSX.Element => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
