import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@shared/schema';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  filters: {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    inStock?: boolean;
    isOnSale?: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
  };
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  selectedProduct: null,
  filters: {},
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters?: ProductsState['filters']) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    if (filters?.isOnSale !== undefined) params.append('isOnSale', filters.isOnSale.toString());
    if (filters?.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString());
    if (filters?.isNew !== undefined) params.append('isNew', filters.isNew.toString());

    const response = await fetch(`/api/products?${params}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug: string) => {
    const response = await fetch(`/api/products/slug/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductsState['filters']>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      });
  },
});

export const { setFilters, clearFilters, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
