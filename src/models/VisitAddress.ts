export class VisitAddress {
    state!: string | undefined
    city!: string | undefined
    district!: string | undefined
    street!: string | undefined
    number!: string
    complement!: string | undefined
    cep!: string
}

export class VisitAddressDTO extends VisitAddress {
    id!: number
    medicalDoctorId!: number
}