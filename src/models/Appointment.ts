import { VisitAddressDTO } from "./VisitAddress"

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

export interface AppointmentDto {
    id: number
    startTime: Date
    endTime: Date
    visitAddressDto: VisitAddressDTO
    medicalDoctorSummaryDto: MedicalDoctorySummaryDto
    patientDto: PatientSummaryDto
    confirmedByMedicalDoctor: boolean
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


export interface AppointmentAvailabilityDTO {
    id?: number
    dayOfWeek?: number
    timeBlock?: number
    doctorId?: number
}

export interface AppointmentAvailabilityParams {
    dayOfWeek: number | string
    startTime: Date | string
    endTime: Date | string
}

export interface AppointmentAvailabilityWithBookedParams {
    doctorId: number | undefined | string
    startTime: Date | string
    endTime: Date | string
}


export class AppointmentAvailabilityHelper {
    date!: Date | string
    availability!: number[]
    booked!: number[]
}