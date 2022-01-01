export class Message {

    constructor(readonly id: number,
        readonly text: string,
        readonly date: string,
        readonly isRead: boolean,
        readonly profile: Profile) {
    }

    get formattedText(): string {
        const isLong: boolean = this.text.length > 36
        return isLong ? `${this.text.substring(0, 32)}...` : this.text
    }

}

export class Profile {

    constructor(readonly id: number,
        readonly firstName: string,
        readonly lastName: string,
        readonly photo: string,
        readonly phone?: string,
        readonly location?: string,
        readonly description?: string) {
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

}