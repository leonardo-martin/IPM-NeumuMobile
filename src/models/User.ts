import { NestedValue } from "react-hook-form"

export class SignInData {
    username: string = ''
    password: string = ''
}

export class UserData {
    mothersName: string = ''
    name: string = ''
    cpf: string = ''
    email: string = ''
    phone: string = ''
    phone2?: string
    username: string = ''
    password: string = ''
    cns?: string
    crm?: string
    specialty?: NestedValue<Specialty>
}

class Specialty {
    description: string = ''
}
