import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoriteItem {
  id: number | string;
  bannerImage?: string;
  title?: {
    english?: string;
    native?: string;
    romaji?: string;
  };
  description?: string;
  episodes?: number;
  averageScore?: number;
  status?: string;
  startDate?: { day: number; month: number; year: number };
  endDate?: { day: number; month: number; year: number };
  trailer?: {
    site?: string;
    id?: string;
  };
}

interface FavoritesState {
  favorites: FavoriteItem[];
}

const initialState: FavoritesState = {
  favorites: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites(state, action: PayloadAction<FavoriteItem>) {
      state.favorites.push(action.payload);
    },
    removeFromFavorites(state, action: PayloadAction<FavoriteItem>) {
      state.favorites = state.favorites.filter(
        (item) => item.id !== action.payload.id
      );
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
