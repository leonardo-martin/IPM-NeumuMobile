import { UnderagePermissionDto, UnderageStatus } from "@models/Underage"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const createUnderagePermission = async (data: UnderagePermissionDto): Promise<AxiosResponse<UnderagePermissionDto, any>> => {
    return await api.post('underage-permission', data)
}

export const updateUnderagePermission = async (data: { email: string }): Promise<AxiosResponse<UnderagePermissionDto, any>> => {
    return await api.put('underage-permission', data)
}

export const getStatus = async (): Promise<AxiosResponse<UnderageStatus>> => {
    return await api.get('underage-permission/status')
}
