import { createSlice } from "@reduxjs/toolkit";

export const act_db = createSlice({
    name: "slicename",
    initialState:"",
    reducers: {
        setdb: (state, action) => {
            return action.payload;
        },
        
    },
});
export const {setdb } = act_db.actions;
export const act_db_Reducer = act_db.reducer;