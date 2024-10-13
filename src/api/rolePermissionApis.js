import API from "./index";
import {normalizeErrorData} from "./adminApis";

export const getAllPermissions = async () => {
    try {
        let response = await API.get(`admin/role/all_permissions`);
        return response.data;
    } catch (error) {
        // if (error.response && error.response.status === 404) {
        //     return null;
        // }
        return normalizeErrorData(error);
    }
}

export const getAllRoles = async () => {
    try {
        let response = await API.get(`admin/role/all_roles`);
        return response.data;
    } catch (error) {
        // if (error.response && error.response.status === 404) {
        //     return null;
        // }
        return normalizeErrorData(error);
    }
}

export const getRoleData = async (roleName) => {
    try {
        let response = await API.get(`admin/role/${roleName}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const createNewRole = async (data) => {
    try {
        let response = await API.post(`admin/role/new_role`, data);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const editRoleData = async (rolename, data) => {
    try {
        let response = await API.post(`admin/role/edit_role/${rolename}`, data);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const removeRole = async (rolename) => {
    try {
        let response = await API.delete(`admin/remove_role/${rolename}`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const getRoleUsers = async (rolename, skip, limit) => {
    try {
        let response = await API.get(`admin/role/users`, {
            params: {
                roleName: rolename,
                skip: skip,
                limit: limit,
            }
        });
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}

export const editUserRoles = async (userId, roleIds) => {
    try {
        let data = {
            "userId": userId,
            "roleIds": roleIds,
        }
        let response = await API.put(`admin/edit_user_roles`, data);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}
