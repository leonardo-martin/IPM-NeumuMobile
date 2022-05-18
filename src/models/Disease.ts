export class DiseaseDto {
    id!: number
    name!: string
    cid!: string
}

export class DiseaseDataDto {
    id!: number
    diseaseId?: number
    payload!: string
}
