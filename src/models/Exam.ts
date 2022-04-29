import { JSONObject } from "./Common"

export class ExamDto {
    id!: number
    patientId!: number
    documentId!: number
    examType!: string
    examDate!: Date | string
    examResultDate!: Date
    data!: JSONObject
}

export class ExamImage {
    examImage!: JSONObject | undefined
}