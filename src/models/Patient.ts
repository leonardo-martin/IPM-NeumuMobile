import { JSONObject } from "./Common"

export class PatientDiaryEntryDto {
    patientId!: number | undefined
    date!: Date
    data!: JSONObject
}

export class PatientDto {
    id!: number
    susNumber!: string | null
    mothersName!: string | null
    sex!: string | null
    abrafeuRegistrationOptIn!: string
    pastExams!: ExamDNA
}

export class ExamDNA {
    exam?: string = ''
    doctor?: {
        crm?: string
    }
}