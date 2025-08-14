import { createSlice } from "@reduxjs/toolkit";

export const tokenslice = createSlice({
    name: "token",
    initialState:{
        jwt:"",
       
    },
    reducers: {
        jwtToken: (state,action) => {
            state.jwt= action.payload;
        },
        
       
    },
});
export const { jwtToken } =  tokenslice.actions;
export const TokenReducer=  tokenslice.reducer;
