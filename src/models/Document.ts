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
    documentId?: number
}

export interface DocBuffer {
    type: "Buffer",
    data: ArrayBuffer
}
