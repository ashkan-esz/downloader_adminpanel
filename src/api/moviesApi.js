import API from "./index";
import {normalizeErrorData} from "./adminApis";

export const addRelationMovie = async (id1, id2, relation) => {
    try {
        let response = await API.put(`/admin/movies/relatedTitle/add/${id1}/${id2}/${relation}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const removeRelationMovie = async (id1, id2) => {
    try {
        let response = await API.delete(`/admin/movies/relatedTitle/remove/${id1}/${id2}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const removeDoc = async (removeType, id) => {
    try {
        let response = await API.delete(`/admin/remove/${removeType}/${id}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}