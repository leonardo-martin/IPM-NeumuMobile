import { SpecialtiesDTO } from "@models/Specialties"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const getSpecialties = async () : Promise<AxiosResponse<SpecialtiesDTO[]>> => {
    return await api.get('specialties')
}