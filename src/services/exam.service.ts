import { Exam } from "@models/Exam"
import { api } from "./api.service"

export const getPatientExamList = async () => {
    return await api.get('/exam/get-patient-exam-list')
}

// TODO
export const uploadExam = async (data: Exam) => {
    return await api.post('/exam/upload-exam', data)
}