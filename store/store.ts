// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import bookReducer from "./bookSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["theme", "books"], // persisted slices
};

const store = configureStore({
  reducer: {
    theme: themeReducer,
    books: bookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;