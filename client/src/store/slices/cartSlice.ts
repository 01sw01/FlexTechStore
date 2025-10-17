import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@shared/schema';

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

interface CartState {
  items: CartItemWithProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string = 'guest') => {
    const response = await fetch(`/api/cart?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, userId }: { productId: string; quantity: number; userId?: string }) => {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, userId: userId || 'guest' }),
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ id, quantity }: { id: string; quantity: number }) => {
    const response = await fetch(`/api/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update cart item');
    return response.json();
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (id: string) => {
    const response = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return id;
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId: string = 'guest') => {
    const response = await fetch(`/api/cart?userId=${userId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to clear cart');
    return response.json();
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index].quantity = action.payload.quantity;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
