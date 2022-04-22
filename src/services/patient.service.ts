import { PatientDiaryEntryDto, PatientDto } from "@models/Patient"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const postDiaryEntry = async (data: PatientDiaryEntryDto) => {
    return await api.post('patient-diary-entry', data)
}

export const updatePatient = async (data: PatientDto) => {
    return await api.post('patient', data)
}

export const getPatient = async (): Promise<AxiosResponse<PatientDto, any>> => {
    return await api.get('patient')
}