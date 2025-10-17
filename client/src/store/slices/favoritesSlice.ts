import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Favorite, Product } from '@shared/schema';

interface FavoriteWithProduct extends Favorite {
  product?: Product;
}

interface FavoritesState {
  items: FavoriteWithProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId: string = 'guest') => {
    const response = await fetch(`/api/favorites?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async ({ productId, userId }: { productId: string; userId?: string }) => {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userId: userId || 'guest' }),
    });
    if (!response.ok) throw new Error('Failed to add favorite');
    return response.json();
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ productId, userId }: { productId: string; userId?: string }) => {
    const response = await fetch(`/api/favorites?userId=${userId || 'guest'}&productId=${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove favorite');
    return productId;
  }
);

export const checkIsFavorite = createAsyncThunk(
  'favorites/checkIsFavorite',
  async ({ productId, userId }: { productId: string; userId?: string }) => {
    const response = await fetch(`/api/favorites/check?userId=${userId || 'guest'}&productId=${productId}`);
    if (!response.ok) throw new Error('Failed to check favorite');
    return response.json();
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.productId !== action.payload);
      });
  },
});

export default favoritesSlice.reducer;
