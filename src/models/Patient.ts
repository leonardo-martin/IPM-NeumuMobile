import { ConsultAppointment } from "./Appointment"
import { JSONObject } from "./Common"
import { ExamDto } from "./Exam"
import { PatientProfileCreatorDto } from "./PatientProfileCreator"
import { TimelineTimeItem } from "./Timeline"
import { UserDto } from "./User"

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
    pastExams?: ExamDNA
}

export class ExamDNA {
    exam!: {
        id: number | string
        description: string
    }
    doctor?: {
        crm?: string
    }
    questions?: JSONObject
}

export interface PatientSummaryDto {
    id: number
    name: string
    patientId: number
}

export class PatientDisplay {
    userDto!: UserDto
    patientDto!: PatientDto
    responsiblePersonEmail!: string | undefined
    exams!: ExamDto[]
    patientProfileCreatorDto!: PatientProfileCreatorDto
    consultAppointments!: ConsultAppointment[]
}