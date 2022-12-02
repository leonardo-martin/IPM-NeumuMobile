import { JSONObject } from "./Common"
import { ExamDNA } from "./Patient"
import { PatientProfileCreatorDto, PatientProfileCreatorTypeEnum } from "./PatientProfileCreator"
import { UserRole } from "./UserRole"
import { VisitAddress } from "./VisitAddress"

export interface AuthenticationPayload {
    accessToken: string
    username: string
    tokenExpireTime: number
}

export class LoginDto {
    username!: string
    password!: string
}

export class UserDto {
    id!: number
    name!: string
    email!: string
    typeOfDocument!: any
    countryCode!: string
    cpf!: string
    rne!: string
    city!: string | null
    state!: string | null;
    phone1!: string;
    phone2!: string | null
    login!: LoginDto | null
    role!: UserRole[]
    dateOfBirth!: Date;
    postalCode!: string | null
    address1!: string | null
    address2!: string | null
    addressComplement!: string | null
    country!: string | null

}

export class UserData {

    constructor(name?: string,
        cpf?: string,
        rne?: string,
        typeOfDocument?: any,
        countryCode?: string,
        email?: string,
        emailConfirmation?: string,
        phone?: string,
        phone2?: string,
        username?: string,
        password?: string,
        city?: string,
        state?: string,
        dateOfBirth?: Date | string,
        postalCode?: string,
        address1?: string,
        address2?: string,
        addressComplement?: string,
        country?: string,
        sex?: string,
    ) {
        this.name = name
        this.cpf = cpf
        this.email = email
        this.emailConfirmation = emailConfirmation
        this.phone = phone
        this.phone2 = phone2
        this.username = username
        this.password = password
        this.city = city
        this.state = state
        this.dateOfBirth = dateOfBirth
        this.postalCode = postalCode
        this.address1 = address1
        this.address2 = address2
        this.addressComplement = addressComplement
        this.country = country
        this.sex = sex
        this.typeOfDocument = typeOfDocument
        this.countryCode = countryCode
        this.rne = rne
    }

    name?: string
    typeOfDocument?: any
    countryCode?: string
    rne?: string
    cpf?: string
    email?: string
    emailConfirmation?: string
    phone?: string
    phone2?: string
    username?: string
    password?: string
    confirmPassword?: string
    city?: string
    state?: string
    dateOfBirth?: Date | string
    postalCode?: string
    address1?: string
    address2?: string
    addressComplement?: string
    country?: string
    sex?: string
}

export class UserPatientData extends UserData {

    partner?: string
    mothersName?: string
    susNumber?: string
    createdPatientProfileId?: string | number
    patientProfileCreatorTypeId?:
        | PatientProfileCreatorTypeEnum
        | number
        | undefined
    data?: JSONObject | string | any
    underAgePatientProfileId?: number
    responsibleEmailKey?: string
    responsibleEmail?: string
    responsibleEmailSent?: boolean
    responsibleEmailOk?: boolean
    abrafeuRegistrationOptIn?: string
    pastExams?: ExamDNA

    constructor(name?: string,
        cpf?: string,
        rne?: string,
        typeOfDocument?: any,
        countryCode?: string,
        email?: string,
        emailConfirmation?: string,
        phone?: string,
        phone2?: string,
        username?: string,
        password?: string,
        confirmPassword?: string,
        city?: string,
        state?: string,
        dateOfBirth?: Date,
        postalCode?: string,
        address1?: string,
        address2?: string,
        addressComplement?: string,
        country?: string,
        sex?: string,
        mothersName?: string, susNumber?: string,
        abrafeuRegistrationOptIn?: string,
        pastExams?: ExamDNA,
        createdPatientProfileId?: string | number,
        patientProfileCreatorTypeId?: PatientProfileCreatorTypeEnum | number,
        data?: JSONObject | string | any,
        underAgePatientProfileId?: number,
        responsibleEmailKey?: string,
        responsibleEmail?: string,
        responsibleEmailSent?: boolean,
        responsibleEmailOk?: boolean,
        partner?: string) {

        super(name, cpf, rne, typeOfDocument, countryCode, email, emailConfirmation, phone, phone2, username,
            password, city, state, dateOfBirth, postalCode, address1, address2, addressComplement, country, sex)
        this.mothersName = mothersName
        this.susNumber = susNumber
        this.createdPatientProfileId = createdPatientProfileId
        this.patientProfileCreatorTypeId = patientProfileCreatorTypeId
        this.data = data
        this.underAgePatientProfileId = underAgePatientProfileId
        this.responsibleEmailKey = responsibleEmailKey
        this.responsibleEmail = responsibleEmail
        this.responsibleEmailSent = responsibleEmailSent
        this.responsibleEmailOk = responsibleEmailOk
        this.abrafeuRegistrationOptIn = abrafeuRegistrationOptIn
        this.pastExams = pastExams
        this.confirmPassword = confirmPassword
        this.partner = partner
        Object.setPrototypeOf(this, UserPatientData.prototype)
    }
}

export class UserDoctorData extends UserData {

    crm?: string
    specialty?: MedicalSpecialtyDto
    professionalTypeId?: string
    visitAddress?: VisitAddress[]

    constructor(name?: string,
        cpf?: string,
        rne?: string,
        typeOfDocument?: any,
        countryCode?: string,
        email?: string,
        emailConfirmation?: string,
        phone?: string,
        phone2?: string,
        username?: string,
        password?: string,
        confirmPassword?: string,
        city?: string,
        state?: string,
        dateOfBirth?: Date,
        postalCode?: string,
        address1?: string,
        address2?: string,
        addressComplement?: string,
        country?: string,
        sex?: string,
        crm?: string, specialty?: MedicalSpecialtyDto,
        professionalTypeId?: string,
        visitAddress?: VisitAddress[]) {

        super(name, cpf, rne, typeOfDocument, countryCode, email, emailConfirmation, phone, phone2, username,
            password, city, state, dateOfBirth, postalCode, address1, address2, addressComplement, country, sex)
        this.crm = crm
        this.specialty = specialty
        this.professionalTypeId = professionalTypeId
        this.confirmPassword = confirmPassword
        this.visitAddress = visitAddress
        Object.setPrototypeOf(this, UserDoctorData.prototype)
    }
}


class MedicalSpecialtyDto {
    id!: number
    description!: string
    professionalTypeId!: string
    others!: JSONObject | string | any
}

export interface UserAccRecoveryPasswdRequest {
    userEmail?: string
    userCpf?: string
    userRnm?: string
}

export class UserAccRecoveryPasswd {
    token!: string
    password!: string
    newPassword!: string
}

export class UserRelatedIdsDto {
    userId!: number
    patientId!: number
    medicalDoctorId!: number
    operatorId!: number
}

export enum EChoicesChangePassword {
    CPF = 'CPF (Cadastro de Pessoa Física)',
    RNM = 'RNM (Registro Nacional Migratório)',
    EMAIL = 'Endereço de E-mail'
}

export interface VerifyUniqueUserKeysDto {
    cpf?: string
    rne?: string
    email?: string
    susNumber?: string
}

export enum ETypeOfDocument {
    CPF = 'CPF',
    RG = 'RG',
    RNM = 'RNM'
}
