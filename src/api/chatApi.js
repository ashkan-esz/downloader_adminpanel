import {CHAT_API} from "./index";
import {normalizeErrorData} from "./adminApis";

export const getChatServiceStatus = async () => {
    try {
        let response = await CHAT_API.get(`/v1/admin/status`);
        return response.data;
    } catch (error) {
        return normalizeErrorData(error);
    }
}
