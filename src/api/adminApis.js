import API from "./index";

export const startWebCrawler = async (configs) => {
    try {
        let queryParams =
            'sourceName=' + configs.sourceName +
            '&mode=' + configs.mode +
            '&handleDomainChange=' + configs.handleDomainChange +
            '&handleDomainChangeOnly=' + configs.handleDomainChangeOnly +
            '&handleCastUpdate=' + configs.handleCastUpdate;
        let response = await API.put(`/admin/crawler/start`, null, {
            params: {
                ...configs,
            },
        });
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const startCrawlUrl = async (data) => {
    try {
        let response = await API.put(`/admin/crawler/crawlUrl`, data);
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

export const updateCrawlerSourceData = async (sourceName, data) => {
    try {
        let response = await API.put(`/admin/crawler/editSource/${sourceName}`, data);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const removeCrawlerSource = async (sourceName) => {
    try {
        let response = await API.delete(`/admin/crawler/removeSource/${sourceName}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

//---------------------------------------------
//---------------------------------------------

export const getBots = async (botId = '') => {
    try {
        let response = await API.get(`/admin/bots?botId=` + botId);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

export const updateBotData = async (botId, data) => {
    try {
        let response = await API.put(`/admin/bots/editBot/${botId}`, data);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const addBotData = async (data) => {
    try {
        let response = await API.put(`/admin/bots/addBot/`, data);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const deleteBotData = async (botId) => {
    try {
        let response = await API.delete(`/admin/bots/deleteBot/` + botId);
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

//---------------------------------------------
//---------------------------------------------

export const getServerAnalysisInTimes = async (fieldName, startTime, endTime, skip, limit) => {
    try {
        let response = await API.get(`/admin/analysis/${fieldName}/${startTime}/${endTime}/${skip}/${limit}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

export const getServerAnalysisCurrentMonth = async (fieldName, page) => {
    try {
        let response = await API.get(`/admin/analysis/currentMonth/${fieldName}/${page}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const resolveServerAnalysis = async (fieldName, id) => {
    try {
        let response = await API.put(`/admin/analysis/resolve/${fieldName}/${id}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

export const resolveServerAnalysisLastDays = async (fieldName, days) => {
    try {
        let response = await API.put(`/admin/analysis/resolve/${fieldName}/lastDays/${days}`);
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

export const getServerStatus = async () => {
    try {
        let response = await API.get(`/admin/server/status`);
        return response.data.data;
    } catch (error) {
        return 'error';
    }
}

//---------------------------------------------
//---------------------------------------------

export const getRemoteBrowsersStatus = async () => {
    try {
        let response = await API.get(`/admin/remotebrowsers/status`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const mutateRemoteBrowserStatus = async (mutateType, bid) => {
    try {
        let response = await API.put(`/admin/remotebrowsers/${mutateType}/${bid}`);
        return response.data.data;
    } catch (error) {
        return 'error';
    }
}

export const checkSourceRemoteBrowsers = async (sourceName, url) => {
    try {
        let response = await API.get(`/admin/remoteBrowsers/checkSource/${sourceName}/${encodeURIComponent(url)}`);
        return response.data.data;
    } catch (error) {
        return 'error';
    }
}

//---------------------------------------------
//---------------------------------------------

export const setMessage = async (data) => {
    try {
        let response = await API.put(`/admin/setMessage`, data);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 400) {
            return error.response.data;
        }
        return 'error';
    }
}

export const getMessage = async () => {
    try {
        let response = await API.get(`/utils/getMessage`);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return {
                message: '',
                date: '',
            };
        }
        return 'error';
    }
}

//---------------------------------------------
//---------------------------------------------

export const addNewAppVersion = async (data, file, setProgress) => {
    try {
        const formData = new FormData();
        formData.append("appFile", file, file.name);
        let response = await API.post(`/admin/addNewAppVersion`, formData, {
            params: {appData: data},
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: data => {
                setProgress(Math.round((100 * data.loaded) / data.total))
            },
        });
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 409 || error.response?.status === 500) {
            return error.response.data;
        }
        return 'error';
    }
}

export const removeAppVersion = async (vid) => {
    try {
        let response = await API.put(`/admin/removeAppVersion/${vid}`);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 400) {
            return error.response.data;
        }
        return 'error';
    }
}

export const getAppVersions = async () => {
    try {
        let response = await API.get(`/admin/appVersions`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}


//---------------------------------------------
//---------------------------------------------

export const check3rdPartApisWorking = async () => {
    try {
        let response = await API.get(`/admin/3rdpartyApis/checkWorking`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

//---------------------------------------------
//---------------------------------------------

export const getCronJobs = async () => {
    try {
        let response = await API.get(`/admin/cronJobs`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const startCronJob = async (jobName) => {
    try {
        let response = await API.put(`/admin/cronJobs/start/${jobName}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

//---------------------------------------------
//---------------------------------------------

export function normalizeErrorData(error) {
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