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