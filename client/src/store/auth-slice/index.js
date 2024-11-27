// client/src/store/auth-slice/index.js 

import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isAuthenticated : false ,
    isLoading : true,
    user : null 
}

const isTokenExpired = (exp) => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return exp < currentTime;  // Compare JWT expiration to current time
}

export const registerUser = createAsyncThunk('/auth/register', 
    async(formData) => {
        const response = await axios.post('http://localhost:5001/api/auth/register', formData, {
            withCredentials : true 
        } );
        return response.data;
    
    }
)

export const loginUser = createAsyncThunk('/auth/login', async(formData) => {
    const response = await axios.post('http://localhost:5001/api/auth/login', formData, {
    // This sends and accepts cookies
        withCredentials: true  
    });
    return response.data;
});

export const logoutUser = createAsyncThunk('/auth/logout', 
    async() => {
        const response = await axios.post('http://localhost:5001/api/auth/logout',
        {}, {
            withCredentials : true 
        } );
        return response.data;
    
    }
)


export const checkAuth = createAsyncThunk('/auth/checkauth', async () => {
    const response = await axios.get('http://localhost:5001/api/auth/check-auth', {
     // Ensures the cookie is sent
        withCredentials: true, 
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        }
    });
    const { success, user } = response.data;
    if (success) {
        const { exp } = user;
        if (isTokenExpired(exp)) {
            throw new Error("Session expired");
        }
    }

    return response.data;
});

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {},
      },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state)=>{
            state.isLoading = true
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        })
        // loginUser
        .addCase(loginUser.pending, (state)=>{
            state.isLoading = true
        })
        // Update loginUser.fulfilled to properly set user data
        .addCase(loginUser.fulfilled, (state, action) => {
            if (action.payload.success) {
              const { user } = action.payload;
              if (!isTokenExpired(user.exp)) {
                state.isAuthenticated = true;
                state.user = {
                  ...user,
                  _id: user.id  // Ensure _id is set
                };
              } else {
                state.isAuthenticated = false;
                state.user = null;
              }
            } else {
              state.isAuthenticated = false;
              state.user = null;
            }
            state.isLoading = false;
          })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        })
        // checkauth
        .addCase(checkAuth.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
            const { success, user } = action.payload;
            if (success && !isTokenExpired(user.exp)) {
              state.isAuthenticated = true;
              state.user = {
                ...user,
                _id: user.id  // Ensure _id is set
              };
            } else {
              state.isAuthenticated = false;
              state.user = null;
            }
            state.isLoading = false;
          })
        .addCase(checkAuth.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        })
        
        // logoutUser
        .addCase(logoutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
    }
})

export const {setUser} = authSlice.actions
export default authSlice.reducer;