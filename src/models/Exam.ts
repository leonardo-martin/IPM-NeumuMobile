import { DateFnsService } from "@ui-kitten/date-fns"
import { _DEFAULT_FORMAT_DATE } from "@constants/date"
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

export class Exam extends ExamDto {

    // get shortenedDescription(): string {
    //     const isLong: boolean = this.data.examDescription.length > 36
    //     return isLong ? `${this.data.examDescription.substring(0, 32)}...` : this.data.examDescription
    // }

    // get dateToString(): string {
    //     const localeDateService = new DateFnsService('pt-BR')
    //     return localeDateService.format(this.examDate, _DEFAULT_FORMAT_DATE)
    // }
}

export class ExamImage {
    examImage!: string
}