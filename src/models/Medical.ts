export class MedicalSpecialtyDto {
    id!: number
    description!: string
    professionalTypeId!: string
}

export class MedicalDoctorDisplay {
    userId!: number
    medicalDoctorId!: number
    professionalTypeId!: number
    state!: string
    city!: string
    address1!: string
    address2!: string
    addressComplement!: string
    phone1!: string
    phone2!: string
    postalCode!: string
    name!: string
    crm!: string
    specialtyId!: string | null
    specialty!: string | null
}

export class MedicalDataAuthorizationDTO {
    doctorId!: number
    doctorName!: string
    doctorCRM!: string
    grantDate!: Date | null | string
    authorizationGranted!: boolean
}
