import { MedicalSpecialtyDto } from "@models/Medical"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const getAll = async () : Promise<AxiosResponse<MedicalSpecialtyDto[], any>> => {
    return await api.get('medical-specialty')
}