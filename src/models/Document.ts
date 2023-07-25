export class DocumentDto {
    id!: number
    documentFormat!: string
    imageUrl!: string
    createdAt!: string
}

export class DocumentDataDto {
    owningUserId?: number
    entityId!: number
    entityType!: string
    documentType!: string
    documentId?: number | string
}

export interface FileDto {
    uri: string
    type: string | null
    fileName: string
    size: number | null
}