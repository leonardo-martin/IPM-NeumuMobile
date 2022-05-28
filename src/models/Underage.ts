export class UnderagePermissionDto {
    id?: number
    patientId?: number
    responsibleEmail!: string
    responsibleEmailSent?: boolean
    responsibleEmailOk?: boolean
}

export enum UnderageStatus {
    NOT_REQUESTED = "not requested",
    GRANTED = "granted",
    PENDING = "pending"
}
