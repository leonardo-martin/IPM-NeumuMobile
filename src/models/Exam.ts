import { DateFnsService } from "@ui-kitten/date-fns"
import { _DEFAULT_FORMAT_DATE } from "@constants/date"
import { JSONObject } from "./Common"
import { DocumentPickerResponse } from "react-native-document-picker"

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