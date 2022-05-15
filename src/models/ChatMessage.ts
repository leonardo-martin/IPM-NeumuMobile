import { ImageRequireSource } from "react-native"

export class Message {

    constructor(readonly text: string | undefined,
        readonly date: string | Date,
        readonly reply: boolean,
        readonly attachment: MessageAttachment | null) {
    }
}

export class MessageAttachment {

    constructor(readonly source: ImageRequireSource) {
        
    }
}

export class Chat {

    constructor(readonly id: number,
        readonly text: string,
        readonly date: string,
        readonly isRead: boolean,
        readonly profile: ChatProfile) {
    }

    get formattedText(): string {
        const isLong: boolean = this.text.length > 36
        return isLong ? `${this.text.substring(0, 32)}...` : this.text
    }

}

export class ChatProfile {

    constructor(readonly id: number,
        readonly firstName: string,
        readonly lastName: string,
        readonly photo?: string,
        readonly phone?: string,
        readonly location?: string,
        readonly description?: string) {
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

}

export class ChatMessageDto {
    id!: number
    senderUserId!: number
    receiverUserId!: number
    payload!: string
    timestamp!: Date | string
}

export class ChatMessageHistoryRequest {
    receiverId?: string | number
    skip?: string | number
    take?: string | number
}

export class ChatListEntryDto {
    id!: number
    timestamp!: Date | string
    senderID!: number
    receiverId!: number
    payload!: string

    receiverName!: string
    senderName!: string

    isSenderMedicalDoctor!: boolean
    isReceiverMedicalDoctor!: boolean
    senderProfessionalType!: string
    receiverProfessionalType!: string

    isSenderOperator!: boolean
    isReceiverOperator!: boolean

    isSenderPatient!: boolean
    isReceiverPatient!: boolean
}