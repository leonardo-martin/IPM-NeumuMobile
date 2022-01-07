import { NestedValue } from "react-hook-form"
import { PatientProfileCreatorDto } from "./PatientProfileCreator"

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
    city: string = ''
    state: string = ''
    acceptTerms: boolean = false
    creator!: PatientProfileCreatorDto
}

class Specialty {
    description: string = ''
}

export class UserAccRecoveryPasswdRequest {
    userEmail!: string
    userCpf!: string
}

export class UserAccRecoveryPasswd {
    token: string = ''
    newPassword: string = ''
}