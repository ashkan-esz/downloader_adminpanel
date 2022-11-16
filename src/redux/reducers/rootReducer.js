import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import * as SecureStore from "expo-secure-store";
// import FilesystemStorage from 'redux-persist-filesystem-storage';
import userReducer, {userPersistStates} from '../slices/user.slice';
import authReducer, {authPersistStates} from '../slices/auth.slice';


export const authPersistConfig = {
    timeout: 2000,
    key: 'auth',
    storage: storage,
    whitelist: authPersistStates,
}

export const userPersistConfig = {
    timeout: 1000,
    key: 'user',
    storage: storage,
    whitelist: userPersistStates,
}

const appReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    user: persistReducer(userPersistConfig, userReducer),
});

export default function rootReducer(state, action) {
    if (action.type === 'USER_LOGOUT') {
        //reset all states
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
}
