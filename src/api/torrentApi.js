import {TORRENT_API} from "./index";
import {normalizeErrorData} from "./adminApis";

export const downloadTorrent = async (movieId, link) => {
    try {
        let response = await TORRENT_API.put(`/v1/torrent/download/${movieId}/?link=${link}`);
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
