import { MedicalDataAuthorizationDTO } from "@models/Medical"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const patientGetAuthorizationRequests = async (data: { authorized: boolean }): Promise<AxiosResponse<MedicalDataAuthorizationDTO[], any>> => {
    return await api.post('medical-data-authorization/patient-get-authorization-requests', data)
}

export const patientGrantAuthorization = async (data: { medicalDoctorId: string, authorization: boolean }): Promise<AxiosResponse<MedicalDataAuthorizationDTO[], any>> => {
    return await api.post('medical-data-authorization/patient-grant-or-refuse-authorization', data)
}