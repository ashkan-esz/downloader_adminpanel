import API from "./index";

export const authEndpoints_all = [
    '/admin/login',
    '/admin/getToken',
    '/users/logout'
];

export const authEndpoints = [
    '/admin/login',
    '/admin/getToken',
];
export const tokenEndPoint = '/admin/getToken';

//auth
export const loginApi = async (data) => {
    try {
        const response = await API.post('/admin/login', data);
        return response.data;
    } catch (error) {
        if (!error.response) {
            error.response = {
                data: {
                    errorMessage: "Unknown error",
                }
            }
        }
        if (!error.response.data.errorMessage) {
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const logoutApi = async () => {
    try {
        const response = await API.put('/users/logout');
        return response.data;
    } catch (error) {
        if (
            !error.response.data.errorMessage ||
            (error.response && error.response.status === 403)
        ) {
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const forceLogoutApi = async (deviceId) => {
    try {
        const response = await API.put(`/users/forceLogout/${deviceId}`);
        return response.data;
    } catch (error) {
        if (
            !error.response.data.errorMessage ||
            (error.response && (error.response.status === 401 || error.response.status === 403))
        ) {
            if (!error.response.data || !error.response.data.errorMessage) {
                error.response.data = {errorMessage: 'unknown error'};
            }
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const forceLogoutAllApi = async () => {
    try {
        const response = await API.put('/users/forceLogoutAll');
        return response.data;
    } catch (error) {
        if (!error.response.data.errorMessage || (error.response && (error.response.status === 401 || error.response.status === 403))) {
            if (!error.response.data || !error.response.data.errorMessage) {
                error.response.data = {errorMessage: 'unknown error'};
            }
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const getProfileDataApi = async () => {
    try {
        const response = await API.get('/users/myProfile');
        return response.data;
    } catch (error) {
        if (!error.response) {
            error.response = {
                data: {
                    errorMessage: "Unknown error",
                }
            }
        }
        if (error.response.data.errorMessage) {
            return error.response.data.errorMessage;
        }
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            return 'unknown error';
        }
        return error.response.data;
    }
}

export const getActiveSessionsApi = async () => {
    try {
        const response = await API.get('/users/activeSessions');
        return response.data;
    } catch (error) {
        if (error.response.data.errorMessage) {
            return error.response.data.errorMessage;
        }
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            return 'unknown error';
        }
        return error.response.data;
    }
}

export const sendVerifyEmailApi = async () => {
    try {
        const response = await API.get('/users/sendVerifyEmail');
        return response.data;
    } catch (error) {
        if (error.response.data.errorMessage) {
            return error.response.data.errorMessage;
        }
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            return 'unknown error';
        }
        return error.response.data;
    }
}
