export enum EUserRole {
    patient = 1,
    medicalDoctor = 2,
    administrator = 3,
    specialist = 4,
    operator = 5
}

export class UserRole {

    constructor(id: number, type: string) {
        this.id = id
        this.type = type
    }

    id: EUserRole.patient | EUserRole.medicalDoctor | EUserRole.administrator | EUserRole.specialist | EUserRole.operator
    type: string
}
