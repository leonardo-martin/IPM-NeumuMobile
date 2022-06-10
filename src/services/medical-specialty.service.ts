import { MedicalSpecialtyDto } from "@models/Medical"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const getAll = async () : Promise<AxiosResponse<MedicalSpecialtyDto[], any>> => {
    return await api.get('medical-specialty')
}

export const getOne = async (id: string | number) : Promise<AxiosResponse<MedicalSpecialtyDto, any>> => {
    return await api.get(`medical-specialty/${id}`)
}