import { PatientDiaryEntryDto, PatientDto } from "@models/Patient"
import { CalendarRange } from "@ui-kitten/components"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const postDiaryEntry = async (data: PatientDiaryEntryDto) => {
    return await api.post('patient-diary-entry', data)
}

export const getDiaryEntry = async (patientId: string, date: Date): Promise<AxiosResponse<PatientDiaryEntryDto, any>> => {
    const params = new URLSearchParams()
    params.append('patientId', patientId)
    params.append('date', date.toISOString())

    return await api.get('patient-diary-entry?' + params)
}

export const getDiaryEntryByRange = async (patientId: string, range: CalendarRange<Date>): Promise<AxiosResponse<PatientDiaryEntryDto[], any>> => {
    const params = new URLSearchParams()
    params.append('patientId', patientId)
    if (range.startDate)
        params.append('startDate', range.startDate.toISOString())
    if (range.endDate)
        params.append('endDate', range.endDate.toISOString())

    return await api.get('patient-diary-entry/get-by-range?' + params)
}

export const updatePatient = async (data: PatientDto) => {
    return await api.post('patient', data)
}

export const getPatient = async (): Promise<AxiosResponse<PatientDto, any>> => {
    return await api.get('patient')
}