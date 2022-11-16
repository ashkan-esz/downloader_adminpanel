import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import * as authApis from "../../api/authApis";
import {purgeStoredState} from "redux-persist";

const userLogin_api = createAsyncThunk(
    'auth/userLogin_api',
    async (formData, thunkAPI) => {
        return await authApis.loginApi(formData);
    }
);

const logout_api = createAsyncThunk(
    'auth/logout_api',
    async (callLogoutApi, thunkAPI) => {
        thunkAPI.dispatch({type: 'auth/setLoggingOutFlag', payload: true});
        let result = null;
        if (callLogoutApi) {
            result = await authApis.logoutApi();
        }
        if (!callLogoutApi || (result && !result.errorMessage)) {
            thunkAPI.dispatch({type: 'USER_LOGOUT'});
            try {
                await purgeStoredState(thunkAPI.extra.authPersistConfig);
                await purgeStoredState(thunkAPI.extra.userPersistConfig);
            } catch (error) {
            }
        }
        thunkAPI.dispatch({type: 'auth/setForceLoggedOutFlag', payload: false});
        thunkAPI.dispatch({type: 'auth/setLoggingOutFlag', payload: false});
        return result;
    }
);

const sendVerifyEmail_api = createAsyncThunk(
    'auth/sendVerifyEmail_api',
    async (_, thunkAPI) => {
        return await authApis.sendVerifyEmailApi();
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        thisDevice: null,
        username: '',
        userId: '',
        isLoggedIn: false,
        accessToken: '',
        accessToken_expire: 0,
        forceLoggedOut: false,
        isFetchingToken: false,
        isLoading: false,
        isLoggingOut: false,
        authError: '',
        message: '',
    },
    reducers: {
        updateTokens: (state, action) => {
            updateTokensState(state, action);
        },
        setDeviceSessionAndUsername: (state, action) => {
            state.thisDevice = action.payload.thisDevice;
            state.username = action.payload.username;
        },
        setIsFetchingToken: (state, action) => {
            state.isFetchingToken = action.payload;
        },
        setForceLoggedOutFlag: (state, action) => {
            //todo : change
            state.isLoggedIn = false;
            state.forceLoggedOut = action.payload;
        },
        setLoggingOutFlag: (state, action) => {
            state.isLoggingOut = action.payload;
        },
        resetAuthError: (state, action) => {
            state.authError = '';
        },
        resetMessage: (state, action) => {
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin_api.pending, (state, action) => {
            state.isLoading = true;
            state.authError = '';
        });
        builder.addCase(sendVerifyEmail_api.pending, (state, action) => {
            state.isLoading = true;
            state.authError = '';
        });
        builder.addCase(userLogin_api.fulfilled, (state, action) => {
            addUserData(state, action);
        });
        builder.addCase(sendVerifyEmail_api.fulfilled, (state, action) => {
            if (typeof action.payload === 'string') {
                state.authError = action.payload.toString();
            } else {
                state.authError = '';
                state.message = 'verification email sent';
            }
            state.isLoading = false;
        });
    },
});

const addUserData = (state, action) => {
    const {
        username, userId, errorMessage,
        accessToken, accessToken_expire,
    } = action.payload;
    if (errorMessage) {
        state.authError = errorMessage;
    } else {
        state.username = username;
        state.userId = userId;
        state.isLoggedIn = true;
        state.accessToken = accessToken;
        state.accessToken_expire = accessToken_expire;
    }
    state.isLoading = false;
}

const updateTokensState = (state, action) => {
    const {
        username, accessToken, accessToken_expire,
    } = action.payload;
    state.username = username;
    state.accessToken = accessToken;
    state.accessToken_expire = accessToken_expire;
    state.isFetchingToken = false;
}

export const authPersistStates = ['username', 'userId', 'isLoggedIn'];

export const {
    updateTokens,
    setDeviceSessionAndUsername,
    setIsFetchingToken,
    setForceLoggedOutFlag,
    setLoggingOutFlag,
    resetAuthError,
    resetMessage,
} = authSlice.actions;

export {
    userLogin_api,
    logout_api,
    sendVerifyEmail_api,
};

export default authSlice.reducer;
