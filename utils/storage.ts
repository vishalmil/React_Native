import AsyncStorage from '@react-native-async-storage/async-storage';
import {Book} from '../store/bookSlice';

export type UserCreds = {
  username: string;
  email: string;
  password: string;
  image: string | null | undefined;
  dob: string | null | undefined;
  gender: string | null;
};

const USER_KEY = '@user_creds';

export const saveCredentials = async (creds: UserCreds) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(creds));
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
};

export const getCredentials = async (): Promise<UserCreds | null> => {
  try {
    const creds = await AsyncStorage.getItem(USER_KEY);
    return creds ? JSON.parse(creds) : null;
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    return null;
  }
};

export const clearCredentials = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing credentials:', error);
  }
};


/* ---------------------- APP SETTINGS ---------------------- */
const THEME_KEY = '@app_theme';

export const setTheme = async(theme: 'light' | 'dark') =>{
  try{
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const getTheme = async (): Promise<'light' | 'dark' | null> => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme as 'light' | 'dark' | null;
  } catch (error) {
    console.error('Error retrieving theme', error);
    return null;
  }
};


//Books
const FAVORITES_KEY = '@favorites';

export const saveFavorites = async (books: Book[]) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(books));
  } catch (e) {
    console.error('Error saving favorites', e);
  }
};

export const getFavorites = async (): Promise<Book[]> => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading favorites', e);
    return [];
  }
};
