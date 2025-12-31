import { instance } from "../instance/instance"

// Principal
export const getPrincipalReq = async () => {
    try {
        const response = await instance.get("/auth/principal");
        return response.data;
    } catch (error) {
        console.error('principal 요청 실패 : ', error);
        throw error;
    }
}