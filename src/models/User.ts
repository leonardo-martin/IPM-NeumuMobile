import { JSONObject } from "./Common"
import { ExamDNA } from "./Patient"
import { PatientProfileCreatorDto } from "./PatientProfileCreator"
import { UserRole } from "./UserRole"

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
    cpf!: string
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
    }

    name?: string
    cpf?: string
    email?: string
    emailConfirmation?: string
    phone?: string
    phone2?: string
    username?: string
    password?: string
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

    mothersName?: string
    susNumber?: string
    creator?: PatientProfileCreatorDto
    abrafeuRegistrationOptIn?: string
    pastExams?: ExamDNA

    constructor(name?: string,
        cpf?: string,
        email?: string,
        emailConfirmation?: string,
        phone?: string,
        phone2?: string,
        username?: string,
        password?: string,
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
        creator?: PatientProfileCreatorDto,
        abrafeuRegistrationOptIn?: string,
        pastExams?: ExamDNA) {

        super(name, cpf, email, emailConfirmation, phone, phone2, username,
            password, city, state, dateOfBirth, postalCode, address1, address2, addressComplement, country, sex)
        this.mothersName = mothersName
        this.susNumber = susNumber
        this.creator = creator
        this.abrafeuRegistrationOptIn = abrafeuRegistrationOptIn
        this.pastExams = pastExams
        Object.setPrototypeOf(this, UserPatientData.prototype)
    }
}

export class UserDoctorData extends UserData {

    crm?: string
    specialty?: MedicalSpecialtyDto
    professionalTypeId?: string

    constructor(name?: string,
        cpf?: string,
        email?: string,
        emailConfirmation?: string,
        phone?: string,
        phone2?: string,
        username?: string,
        password?: string,
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
        professionalTypeId?: string) {

        super(name, cpf, email, emailConfirmation, phone, phone2, username,
            password, city, state, dateOfBirth, postalCode, address1, address2, addressComplement, country, sex)
        this.crm = crm
        this.specialty = specialty
        this.professionalTypeId = professionalTypeId
        Object.setPrototypeOf(this, UserDoctorData.prototype)
    }
}


class MedicalSpecialtyDto {
    id!: number
    description!: string
    professionalTypeId!: string
    others!: JSONObject | string | any
}

export class UserAccRecoveryPasswdRequest {
    userEmail!: string
    userCpf!: string
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
