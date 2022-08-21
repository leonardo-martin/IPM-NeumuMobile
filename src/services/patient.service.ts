import { PatientDiaryEntryDto, PatientDisplay, PatientDto } from "@models/Patient"
import { CalendarRange } from "@ui-kitten/components"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const postDiaryEntry = async (data: PatientDiaryEntryDto): Promise<AxiosResponse<PatientDiaryEntryDto, any>> => {
    return await api.post('patient-diary-entry', data)
}

export const updateDiaryEntry = async (data: PatientDiaryEntryDto): Promise<AxiosResponse<PatientDiaryEntryDto, any>> => {
    return await api.put('patient-diary-entry', data)
}

export const getDiaryEntry = async (patientId: string, date: Date): Promise<AxiosResponse<PatientDiaryEntryDto, any>> => {
    const params = new URLSearchParams()
    params.append('patientId', patientId)
    params.append('date', date.toISOString())

    return await api.get('patient-diary-entry?' + params)
}

export const getDiaryEntryByRange = async (patientId: number, range: CalendarRange<Date>, _medicalDoctor: boolean = false): Promise<AxiosResponse<PatientDiaryEntryDto[], any>> => {
    const params = new URLSearchParams()
    params.append('patientId', patientId.toString())
    if (range.startDate)
        params.append('startDate', range.startDate.toISOString())
    if (range.endDate)
        params.append('endDate', range.endDate.toISOString())

    return await api.get(`patient-diary-entry/get-by-range${_medicalDoctor ? '-doctor' : ''}?` + params)
}

export const deleteDiaryEntry = async (date: Date) => {
    const params = new URLSearchParams()
    params.append('date', date.toISOString())
    return api.delete('patient-diary-entry?' + params)
}

export const updatePatient = async (data: PatientDto | any): Promise<AxiosResponse<PatientDto, any>> => {
    var body = {
        ...data,
        pastExams: JSON.stringify({
            ...data.pastExams,
            ...data.pastExams?.questions && {
                questions: {
                    one: data.pastExams.questions.one === 0,
                    two: data.pastExams.questions.two === 0
                }
            }
        }) ?? JSON.stringify({})
    }
    return await api.post('patient', body)
}

export const getPatient = async (): Promise<AxiosResponse<PatientDto, any>> => {
    return await api.get('patient')
}

export const getPatientDisplayAsDoc = async (patientId: number | string): Promise<AxiosResponse<PatientDisplay, any>> => {
    const params = new URLSearchParams()
    params.append('patientId', patientId.toString())
    return await api.get('patient/patient-display-as-doctor?' + params).catch(e => e.response)
}

export const getPatientDisplay = async (): Promise<AxiosResponse<PatientDisplay>> => {
    return await api.get('patient/patient-display')
}