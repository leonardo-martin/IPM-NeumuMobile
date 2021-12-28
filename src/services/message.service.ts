export class Message {

    constructor(readonly text: string,
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

    constructor(readonly firstName: string,
        readonly lastName: string,
        readonly photo: string) {
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

}

