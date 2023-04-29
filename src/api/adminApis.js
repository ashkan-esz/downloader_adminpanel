import API from "./index";

export const startWebCrawler = async (configs) => {
    try {
        let queryParams =
            'sourceName=' + configs.sourceName +
            '&mode=' + configs.mode +
            '&handleDomainChange=' + configs.handleDomainChange +
            '&handleDomainChangeOnly=' + configs.handleDomainChangeOnly +
            '&handleCastUpdate=' + configs.handleCastUpdate;
        let response = await API.put(`/admin/crawler/start?${queryParams}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const pauseWebCrawler = async (duration) => {
    try {
        let response = await API.put(`/admin/crawler/pause/${duration}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const resumeWebCrawler = async (force) => {
    try {
        let response = await API.put(`/admin/crawler/resume/${force}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const stopWebCrawler = async () => {
    try {
        let response = await API.put(`/admin/crawler/stop`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const getCrawlerStatus = async () => {
    try {
        let response = await API.get(`/admin/crawler/status`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

export const getCrawlerHistory = async (startTime, endTime, skip, limit) => {
    try {
        let response = await API.get(`/admin/crawler/history/${startTime}/${endTime}/${skip}/${limit}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

export const getCrawlerSources = async () => {
    try {
        let response = await API.get(`/admin/crawler/sources`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

export const resolveCrawlerWarnings = async (id) => {
    try {
        let response = await API.put(`/admin/crawler/warnings/resolve/${id}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getCrawlerWarnings = async () => {
    try {
        let response = await API.get(`/admin/crawler/warnings`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const updateCrawlerSourceData = async (sourceName, data) => {
    try {
        let response = await API.put(`/admin/crawler/editSource/${sourceName}`, data);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

//---------------------------------------------
//---------------------------------------------

export const updateConfigs = async (data) => {
    try {
        let response = await API.put('/admin/configs/update/', data);
        return response.data.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const getConfigs = async () => {
    try {
        let response = await API.get('/admin/configs');
        return response.data.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

//---------------------------------------------
//---------------------------------------------

export const addCrawlerSource = async (data) => {
    try {
        let response = await API.put(`/admin/crawler/addSource/`, data);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const getAnalysisActiveUsers = async (startTime, endTime, skip, limit) => {
    try {
        let response = await API.get(`/admin/analysis/activeUsers/${startTime}/${endTime}/${skip}/${limit}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

//---------------------------------------------
//---------------------------------------------

function normalizeErrorData(error) {
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