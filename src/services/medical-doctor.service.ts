import { MedicalDataAuthorizationDTO, MedicalDoctorDisplay } from "@models/Medical"
import { AxiosResponse } from "axios"
import { api } from "./api.service"


export const getDisplayMedicalDoctorBySpecialtyArray = async (specialtyIdArray: number[]): Promise<AxiosResponse<MedicalDoctorDisplay[], any>> => {
    return await api.post('medicaldoctor/get-display-by-specialty-array', specialtyIdArray)
}

export const requestAuthorizationAsDoctor = async (patientId: number | string): Promise<AxiosResponse<MedicalDataAuthorizationDTO, any>> => {
    const params = new URLSearchParams()
    params.append('patientId', patientId.toString())
    return await api.post('medical-data-authorization/medicaldoctor-request-authorization?' + params)
        .catch(e => {
            throw e.response
        })
}

