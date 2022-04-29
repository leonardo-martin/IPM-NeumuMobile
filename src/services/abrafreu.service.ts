import { AbrafeuOptInDto } from "@models/Abrafeu"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const optIn = async (): Promise<AxiosResponse<AbrafeuOptInDto, any>> => {
    return await api.get('abrafeu-opt-in/opt-in')
}

export const optOut = async (): Promise<AxiosResponse<AbrafeuOptInDto, any>> => {
    return await api.get('abrafeu-opt-in/opt-out')
}