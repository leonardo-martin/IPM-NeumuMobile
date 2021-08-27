export class SignInData {
    username: string = ''
    password: string = ''
}

export class UserData {
    name: string = ''
    cpf: string = ''
    email: string = ''
    phone: string = ''
    phone2?: string | null
    username: string = ''
    password: string = ''
    cns?: string | null
    crm?: string | null
    specialty?: Specialty | null
}

class Specialty {
    description: string = ''
}
