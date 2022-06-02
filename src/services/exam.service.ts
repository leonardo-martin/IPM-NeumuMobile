import { ExamDto } from "@models/Exam"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const getPatientExamList = async () => {
    return await api.get('exam/get-patient-exam-list')
}

export const uploadExam = async (data: ExamDto): Promise<AxiosResponse<ExamDto, any>> => {
    return await api.post('exam/upload-exam', data)
}

export const updateExam = async (data: ExamDto): Promise<AxiosResponse<ExamDto, any>> => {
    return await api.post('exam/update-exam', data)
}

export const deleteExam = async (examId: number): Promise<AxiosResponse<ExamDto, any>> => {

    const params = new URLSearchParams()
    params.append('examId', examId.toString())

    return await api.post('exam/delete-exam?' + params)
}
