import API, {TORRENT_API} from "./index";
import {authEndpoints, tokenEndPoint} from "./authApis";

let store;
let tokenServerError = false;

//todo : check again, need remove and change
const errorMessages = {
    '401': 'Error: Request failed with status code 401',
    '403': 'Error: Request failed with status code 403',
    '500': 'Error: Request failed with status code 500',
}

export const injectStore = _store => {
    store = _store;
}

const accessTokenShouldBeRefreshed = () => (
    !store.getState().auth.accessToken ||
    store.getState().auth.accessToken_expire - Date.now() < 15000
);

const enableForceLogoutIfNeeded = (error) => {
    if (
        (error.response && error.response.status === 401) ||
        error.toString() === 'Error: Request failed with status code 401') {
        store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
    }
}

const addDeviceInfo = (config) => {
    try {
        if (!config.data) {
            config.data = {};
        }

        config.data.deviceInfo = {
            appName: "downloader_adminPanel",
            appVersion: "1.0.0",
            os: "unknown",
            deviceModel: "unknown",
            notifToken: "ttt", //todo : implement
        };
    } catch (error) {
        if (!config.data) {
            config.data = {};
        }
        config.data.deviceInfo = null;
    }
}

const showToast = () => {
    // Toast.show({
    //     type: 'error',
    //     text1: 'Server side error',
    //     position: 'bottom',
    //     onPress: () => {
    //         Toast.hide();
    //     },
    //     visibilityTime: 10000,
    // });
}

const waitForTokenFetch = async () => {
    while (store.getState().auth.isFetchingToken) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

const waitForTokenErrorFix = async () => {
    while (tokenServerError) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

const handleTokenServerError = async (originalConfig) => {
    if (!originalConfig._retryCounter) {
        tokenServerError = true;
    }
    originalConfig._retryCounter = (originalConfig._retryCounter || 0) + 1;
    if (originalConfig._retryCounter < 5) {
        // showToast();
        await new Promise(resolve => setTimeout(resolve, 5000));
        return 'retry';
    }
    // Toast.hide();
    store.dispatch({type: "user/setCloseAppFlag", payload: true});
    return null;
}

const handleTokenRequest = async () => {
    try {
        store.dispatch({type: "auth/setIsFetchingToken", payload: true});
        const rs = await API.put(tokenEndPoint);
        tokenServerError = false;
        //stale refreshToken or refreshToken doesn't match (force logout)
        if (rs.toString() === errorMessages["401"]) {
            store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
            return 'logout';
        } else {
            store.dispatch({type: "auth/updateTokens", payload: rs.data});
            store.dispatch({type: "user/setProfileImages", payload: rs.data.profileImages});
            return 'retry';
        }
    } catch (_error) {
        store.dispatch({type: "auth/setIsFetchingToken", payload: false});
        enableForceLogoutIfNeeded(_error);
        return _error;
    }
}

//todo : handle 429
//todo : fix error with waiting on logout overlay
//todo : fix : false forceLogout when internet reconnect

API.interceptors.request.use(async (config) => {
    if (!authEndpoints.includes(config.url)) {
        await waitForTokenErrorFix();

        if (!store.getState().auth.isFetchingToken && accessTokenShouldBeRefreshed()) {
            await handleTokenRequest();
        }

        await waitForTokenFetch();
        await waitForTokenErrorFix();
    }

    if (authEndpoints.includes(config.url)) {
        addDeviceInfo(config);
    }

    config.headers.authorization = `Bearer ${store.getState().auth.accessToken}`;
    return config;
});

TORRENT_API.interceptors.request.use(async (config) => {
    if (!authEndpoints.includes(config.url)) {
        await waitForTokenErrorFix();

        if (!store.getState().auth.isFetchingToken && accessTokenShouldBeRefreshed()) {
            await handleTokenRequest();
        }

        await waitForTokenFetch();
        await waitForTokenErrorFix();
    }

    if (authEndpoints.includes(config.url)) {
        addDeviceInfo(config);
    }

    config.headers.authorization = `Bearer ${store.getState().auth.accessToken}`;
    return config;
});

API.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (!authEndpoints.includes(originalConfig.url)) {
            await waitForTokenErrorFix();

            if (
                (err.response && err.response.status === 401) ||
                err.toString() === errorMessages["401"]) {
                //stale refreshToken or refreshToken doesn't match (force logout)
                store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
                return Promise.reject(err);
            }
            if (!store.getState().auth.isFetchingToken && err.response.status === 403 && !originalConfig._retry) {
                originalConfig._retry = true;
                let result = await handleTokenRequest();
                if (result === 'retry') {
                    return API(originalConfig);
                }
                if (result !== 'logout') {
                    return Promise.reject(result);
                }
            }

            await waitForTokenFetch();
            await waitForTokenErrorFix();
        }

        if (originalConfig.url === tokenEndPoint && err.toString() === errorMessages["500"]) {
            let result = await handleTokenServerError(originalConfig);
            if (result === 'retry') {
                return API(originalConfig);
            }
        }

        return Promise.reject(err);
    }
);
