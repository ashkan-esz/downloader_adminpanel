import {TORRENT_API} from "./index";
import {normalizeErrorData} from "./adminApis";

export const downloadTorrent = async (movieId, link, downloadNow = true) => {
    try {
        let response = await TORRENT_API.put(`/v1/torrent/download/${movieId}`, null, {
            params: {
                link: link,
                downloadNow: downloadNow,
            }
        });
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const extendExpireTime = async (filename) => {
    try {
        let response = await TORRENT_API.put(`/v1/torrent/extend_expire_time/${filename}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const cancelTorrentDownload = async (filename) => {
    try {
        let response = await TORRENT_API.put(`/v1/torrent/cancel/${filename}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const removeTorrentDownload = async (filename) => {
    try {
        let response = await TORRENT_API.delete(`/v1/torrent/remove/${filename}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const torrentStatus = async () => {
    try {
        let response = await TORRENT_API.get(`/v1/torrent/status`);
        return response.data.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const streamStatus = async () => {
    try {
        let response = await TORRENT_API.get(`/v1/stream/status`);
        return response.data.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const fetchConfigs = async () => {
    try {
        let response = await TORRENT_API.get(`/v1/admin/fetch_configs`);
        return response.data.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const getLimits = async () => {
    try {
        let response = await TORRENT_API.get(`/v1/torrent/limits`);
        return response.data.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}
