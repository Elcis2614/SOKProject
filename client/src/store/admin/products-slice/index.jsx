// client/src/store/admin/products-slice/index.jsx 

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading : false,
    ProductList : []

}

export const addNewProduct = createAsyncThunk(
    "/products/addNewProduct",
   async (formData) => {
        const result = await axios.post('http://localhost:5001/api/admin/products/add', formData, {
            headers : {
                'content-Type' : 'application/json'
            }
        
        });
        return result?.data;
    }
);
export const fetchAllProducts = createAsyncThunk(
    "/products/fetchAllProducts",
   async () => {
        const result = await axios.get('http://localhost:5001/api/admin/products/get'
        );
        return result?.data;
    }
);

export const editProduct = createAsyncThunk(
    "/products/editProduct",
    async ({ id, formData }) => { // Destructure the payload to extract `id` and `formData`
        const result = await axios.put(`http://localhost:5001/api/admin/products/edit/${id}`, formData, {
            headers: {
                'content-Type': 'application/json'
            }
        });
        return result?.data;
    }
);


export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",
   async (id) => {
        const result = await axios.delete(`http://localhost:5001/api/admin/products/delete/${id}`
        );
        
        return result?.data;
    }
)


const AdminProductsSlice = createSlice({
    name : 'adminProducts',
    initialState,
    reducers : {},
    extraReducers :(builder) => {
        builder
        .addCase(fetchAllProducts.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchAllProducts.fulfilled, (state, action) => {
          state.isLoading = false;
          state.productList = action.payload.data;
        })
        .addCase(fetchAllProducts.rejected, (state, action) => {
          state.isLoading = false;
          state.productList = [];
        });
    
    }
})

export default AdminProductsSlice.reducer