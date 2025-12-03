// store/themeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "./store";

export type ThemeType = "light" | "dark";

interface ThemeState {
  theme: ThemeType;
}

const initialState: ThemeState = {
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;

// 🔹 Load saved theme from storage
export const loadTheme = () => async (dispatch: AppDispatch) => {
  const saved = await AsyncStorage.getItem("@theme");
  if (saved === "dark") {
    dispatch(setTheme("dark"));
  } else {
    dispatch(setTheme("light"));
  }
};

// 🔹 Save theme to storage
export const saveTheme =
  (theme: ThemeType) => async (dispatch: AppDispatch) => {
    await AsyncStorage.setItem("@theme", theme);
    dispatch(setTheme(theme));
  };