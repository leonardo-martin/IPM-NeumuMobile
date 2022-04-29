import { MedicalDoctorDisplay } from "@models/Medical"
import { AxiosResponse } from "axios"
import { api } from "./api.service"


export const getDisplayMedicalDoctorBySpecialtyArray = async (specialtyIdArray: number[]): Promise<AxiosResponse<MedicalDoctorDisplay[], any>> => {
    return await api.post('medicaldoctor/get-display-by-specialty-array', specialtyIdArray)
}