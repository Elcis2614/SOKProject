// client/src/store/shop/cart-slice/index.jsx 

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    _id: null,   // The cart ID
    cartItems : [],
    isLoading : false
    

}

export const addToCart = createAsyncThunk(
  'cart/addToCart', 
  async({ userId, productId, quantity }) =>{
    const response = await axios.post(
      'http://localhost:5001/api/shop/cart/add', 
      {
        userId,
        productId,
        quantity,  
        }
    );
    return response.data;
});

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (userId, { rejectWithValue }) => {
      try {
          const response = await axios.get(
              `http://localhost:5001/api/shop/cart/get/${userId}`,
              { withCredentials: true }
          );
          return response.data;
      } catch (error) {
          console.error("Fetch Cart Items failed:", error.response?.data || error.message);
          return rejectWithValue(error.response?.data || { message: error.message });
      }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/shop/cart/${userId}/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        'http://localhost:5001/api/shop/cart/update',
        { userId, productId, quantity }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(addToCart.pending, (state) => { // addToCart
          state.isLoading = true;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
          console.log("Add to Cart successful, payload:", action.payload);  // Log the payload
          state.isLoading = false;
          state.cartItems = action.payload.data || [];  // Update cart items
        })
        .addCase(addToCart.rejected, (state, action) => {
          console.error("Add to Cart failed:", action.error);  // Log any errors
          state.isLoading = false;
          state.cartItems = [];
        })
        .addCase(fetchCartItems.pending, (state) => {
          state.isLoading = true;
          state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
          state.isLoading = false;
          state._id = action.payload.data._id; // Add this line
          state.cartItems = action.payload.data.items || [];
          state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
          state.isLoading = false;
          state.cartItems = [];
          state.error = action.payload?.message || "Failed to fetch cart items";
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data && Array.isArray(action.payload.data.items)) {
          state.cartItems = action.payload.data.items;
        } else {
          console.error('Unexpected payload structure:', action.payload);
          // Maintain the current state if the payload is not as expected
        }
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update cart item quantity";
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = state.cartItems.filter(item => item.productId !== action.payload.deletedProductId);
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete cart item";
      });
    },
  });
  
  export default shoppingCartSlice.reducer;