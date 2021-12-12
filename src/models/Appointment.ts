export class CreateAppointment {

    constructor(patientId: number | undefined, doctorId: number, startTime: string, endTime: string, visitAddressId: number) {
        this.patientId = patientId
        this.doctorId = doctorId
        this.startTime = startTime
        this.endTime = endTime
        this.visitAddressId = visitAddressId
    }

    patientId: number | undefined
    doctorId: number
    startTime: string
    endTime: string
    visitAddressId: number
}

export interface Appointment {
    id: number
    startTime: Date
    endTime: Date
    visitAddressDto: VisitAddressDto
    medicalDoctorSummaryDto: MedicalDoctorySummaryDto
    patientDto: PatientSummaryDto
    confirmedByMedicalDoctor: boolean
}

export interface VisitAddressDto {
    id: number
    state: string
    city: string
    district: string
    street: string
    number: string
    complement: string
    medicalDoctorId: number
    cep: string
}

export interface MedicalDoctorySummaryDto {
    name: string
    specialty: string
    crm: string
}

export interface PatientSummaryDto {
    name: string
    patientId: number
}