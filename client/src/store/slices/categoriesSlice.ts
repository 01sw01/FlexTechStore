import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Category } from '@shared/schema';

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: Category | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }
);

export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchCategoryBySlug',
  async (slug: string) => {
    const response = await fetch(`/api/categories/slug/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      });
  },
});

export const { clearSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
