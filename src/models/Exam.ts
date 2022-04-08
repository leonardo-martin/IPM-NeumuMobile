import { DateFnsService } from "@ui-kitten/date-fns"
import { _DEFAULT_FORMAT_DATE } from "@constants/date"

export class Exam {

    id!: number
    patientId!: string
    documentId!: number
    examType!: string
    examDate!: Date
    examResultDate!: Date
    examDescription!: string
    data?: JSON
    
    get shortenedDescription(): string {
        const isLong: boolean = this.examDescription.length > 36
        return isLong ? `${this.examDescription.substring(0, 32)}...` : this.examDescription
    }

    get dateToString(): string {
        const localeDateService = new DateFnsService('pt-BR')
        return localeDateService.format(this.examDate, _DEFAULT_FORMAT_DATE)
    }
}

export class ExamImage {
    examImage!: string
}