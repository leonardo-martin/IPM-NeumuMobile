import { DiseaseDataDto, DiseaseDto } from "@models/Disease"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { api } from "./api.service"

// disease
export const getDiseaseList = async (config?: AxiosRequestConfig): Promise<AxiosResponse<DiseaseDto[]>> => {
    return await api.get('disease', config)
}

// disease data
export const getDiseaseDataById = async (id: number, config?: AxiosRequestConfig): Promise<AxiosResponse<DiseaseDataDto>> => {
    return await api.get(`disease-data/${id}`, config)
}
