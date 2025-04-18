import axios from 'axios';

const {REACT_APP_BASE_URL, REACT_APP_BASE_URL_DEV} = process.env;
const {REACT_APP_CHAT_BASE_URL, REACT_APP_CHAT_BASE_URL_DEV} = process.env;
const {REACT_APP_TORRENT_BASE_URL, REACT_APP_TORRENT_BASE_URL_DEV} = process.env;

const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? window?._env_?.REACT_APP_BASE_URL || REACT_APP_BASE_URL
        : window?._env_?.REACT_APP_BASE_URL_DEV || REACT_APP_BASE_URL_DEV,
    // baseURL: REACT_APP_BASE_URL,
    // baseURL: 'http://localhost:3000',
    // baseURL: 'https://api.movieTracker.site',
    withCredentials: true,
});

export const CHAT_API = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? window?._env_?.REACT_APP_CHAT_BASE_URL || REACT_APP_CHAT_BASE_URL
        : window?._env_?.REACT_APP_CHAT_BASE_URL_DEV || REACT_APP_CHAT_BASE_URL_DEV,
    // baseURL: 'https://chat.movieTracker.site',
    withCredentials: true,
});

export const TORRENT_API = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? window?._env_?.REACT_APP_TORRENT_BASE_URL || REACT_APP_TORRENT_BASE_URL
        : window?._env_?.REACT_APP_TORRENT_BASE_URL_DEV || REACT_APP_TORRENT_BASE_URL_DEV,
    // baseURL: 'https://download.movieTracker.site',
    withCredentials: true,
});

export default API;


//todo : do not print error on (401 | network) error and keep state as loading

//todo : handle errors again


export const searchTitle = async (title, types, dataLevel, page, years = '1900-2025', imdbScores = '0-10', malScores = '0-10') => {
    try {
        title = title.toLowerCase();
        types = types.join('-');
        let response = await API.get(
            `/movies/searchByTitle/${title}/${types}/${dataLevel}/${years}/${imdbScores}/${malScores}/${page}`
        );
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return {
                movies: [],
                staff: [],
                characters: [],
            };
        }
        return 'error';
    }
}

export const searchByID = async (id, dataLevel) => {
    try {
        let response = await API.get(`/movies/searchByID/${id}/${dataLevel}/`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

//--------------------------------
//--------------------------------

export const getNews = async (types, dataLevel, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/news/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getUpdates = async (types, dataLevel, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/updates/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getSortedMovies = async (sortBy, types, dataLevel, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/sortedMovies/${sortBy}/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getMultipleStatus = async (types, dataLevel, count, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/multiple/status/${types}/${dataLevel}/${imdbScores}/${malScores}/${count}/${page}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

export const getTopLikes = async (types, dataLevel, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/topsByLikes/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getTrailers = async (types, dataLevel, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/trailers/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getSeriesOfDay = async (spacing, page, types, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/seriesOfDay/${spacing}/${types}/${imdbScores}/${malScores}/${page}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const likeOrDislikeApi = async (docType, id, type, isRemove) => {
    try {
        if (docType === 'movies') {
            if (type === 'like' || type === 'dislike') {
                type = type + '_movie';
            }
        }
        let url = `/movies/addUserStats/${type}/${id}?remove=${isRemove}`;
        if (docType === 'staff' || docType === 'characters') {
            url = `/movies/addUserStats/${docType}/${type}/${id}?remove=${isRemove}`;
        }
        await API.put(url);
        return 'ok';
    } catch (error) {
        if (error.response && error.response.status === 409) {
            return 'ok'; //already liked
        }
        return 'error';
    }
}

export const getMovieSources = async () => {
    try {
        let response = await API.get('/movies/status/movieSources');
        return response.data.data;
    } catch (error) {
        return 'error';
    }
}