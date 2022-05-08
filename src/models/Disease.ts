export class DiseaseDto {
    id!: number
    name!: string
}

export class DiseaseDataDto {
    id!: number
    diseaseId?: number
    payload!: string
}
