import { createSlice } from "@reduxjs/toolkit";

export const tokenslice = createSlice({
    name: "token",
    initialState:{
        jwt:"",
       
    },
    reducers: {
        jwtToken: (state,action) => {
            return action.payload.jwt;
        },
        
       
    },
});
export const { jwtToken } =  tokenslice.actions;
export const TokenReducer=  tokenslice.reducer;