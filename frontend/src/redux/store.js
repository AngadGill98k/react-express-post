import {configureStore} from "@reduxjs/toolkit";
import { TokenReducer } from "./slices/token";
import { SocketReducer } from "./slices/socket";
import { act_db_Reducer } from "./slices/act_db";
export const store = configureStore({
    reducer: {
        token: TokenReducer,
        socket: SocketReducer,
        db:act_db_Reducer
    },
})