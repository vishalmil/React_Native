import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  publishYear?: number;
}

interface BookState {
  trending: Book[];
  searchResults: Book[];
  favorites: Book[];
}

const initialState: BookState = {
  trending: [],
  searchResults: [],
  favorites: [],
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setTrending: (state, action: PayloadAction<Book[]>) => {
      state.trending = action.payload;
      console.log(action.payload);
    },
    setSearchResults: (state, action: PayloadAction<Book[]>) => {
      state.searchResults = action.payload;
      console.log(action.payload);
    },
    addFavorite: (state, action: PayloadAction<Book>) => {
      state.favorites.push(action.payload);
      console.log(action.payload);
      //AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(b => b.id !== action.payload);
      //AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
    },
    setFavorites: (state, action: PayloadAction<Book[]>) => {
      state.favorites = action.payload;
    },
  },
});

export const { setTrending, setSearchResults, addFavorite, removeFavorite } = bookSlice.actions;
export default bookSlice.reducer;
