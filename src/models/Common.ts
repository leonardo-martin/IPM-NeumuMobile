export enum AscendingOrder {
    ASC = "ASC",
    DESC = "DESC",
}

export interface JSONObject {
    [key: string]: any
}

export enum ApprovalsMessageError {
    REJECTED = "REJECTED",
    NOTVERIFIED = "NOTVERIFIED"
}

export type Icons = {
    name: string
    pack: 'ionicons' | 'eva' | 'feather' | 'font-awesome' | 'fontisto'
}

export declare type JSONContent = {
    type?: string // 'paragraph' | 'heading' | 'text' | ...more
    attrs?: Record<string, any>
    content?: JSONContent[]
    marks?: {
        type: string;
        attrs?: Record<string, any>
        [key: string]: any
    }[];
    text?: string
    [key: string]: any
}

export interface Buffer {
    type: string
    data: ArrayBuffer
}