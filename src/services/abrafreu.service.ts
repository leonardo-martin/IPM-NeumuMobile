import { AbrafeuOptInDto, AbrafeuOptInStatus } from "@models/Abrafeu"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { api } from "./api.service"

export const optIn = async (): Promise<AxiosResponse<AbrafeuOptInDto, any>> => {
    return await api.get('abrafeu-opt-in/opt-in')
}

export const optOut = async (): Promise<AxiosResponse<AbrafeuOptInDto, any>> => {
    return await api.get('abrafeu-opt-in/opt-out')
}

export const getStatusAbrafeuForm = async (config?: AxiosRequestConfig): Promise<AxiosResponse<AbrafeuOptInStatus>> => {
    return await api.get('abrafeu-opt-in/status', config)
}
