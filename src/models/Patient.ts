import { JSONObject } from "./Common"
import { TimelineTimeItem } from "./Timeline"

export class PatientDiaryEntryDto {
    patientId!: number | undefined
    date!: Date | string
    data!: TimelineTimeItem
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