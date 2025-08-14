import { createSlice } from "@reduxjs/toolkit";

export const socket = createSlice({
    name: "socket",
    initialState:{id:""},
    reducers: {
        setsocket: (state, action) => {
               state.id = action.payload.id; 
        },
        
        function4: (state, action) => {
            
        },
    },
});
export const { setsocket, function4 } = socket.actions;
export const SocketReducer = socket.reducer;