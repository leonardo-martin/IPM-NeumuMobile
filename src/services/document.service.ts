import { api } from "./api.service"

// TODO
export const uploadFileUser = async (data: any) => {
    return await api.post('/document/user/upload-file', data)
}