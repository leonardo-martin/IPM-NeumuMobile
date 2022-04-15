import { NestedValue } from "react-hook-form"
import { PatientProfileCreatorDto } from "./PatientProfileCreator"

export class SignInData {
    username!: string
    password!: string
}

export class UserData {

    constructor(name?: string,
        cpf?: string,
        email?: string,
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
        genre?: string,
    ) {
        this.name = name
        this.cpf = cpf
        this.email = email
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
        this.genre = genre
    }

    name?: string
    cpf?: string
    email?: string
    phone?: string
    phone2?: string
    username?: string
    password?: string
    city?: string
    state?: string
    dateOfBirth?: Date
    postalCode?: string
    address1?: string
    address2?: string
    addressComplement?: string
    country?: string
    genre?: string
}

export class UserPatientData extends UserData {

    mothersName?: string
    cns?: string
    creator?: PatientProfileCreatorDto
    abrafeuRegistrationOptIn?: string
    pastExams?: ExamDNA

    constructor(name?: string,
        cpf?: string,
        email?: string,
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
        genre?: string,
        mothersName?: string, cns?: string,
        creator?: PatientProfileCreatorDto,
        abrafeuRegistrationOptIn?: string,
        pastExams?: ExamDNA) {

        super(name, cpf, email, phone, phone2, username,
            password, city, state, dateOfBirth, postalCode, address1, address2, addressComplement, country, genre)
        this.mothersName = mothersName
        this.cns = cns
        this.creator = creator
        this.abrafeuRegistrationOptIn = abrafeuRegistrationOptIn
        this.pastExams = pastExams
        Object.setPrototypeOf(this, UserPatientData.prototype)
    }
}

export class UserDoctorData extends UserData {

    crm?: string
    specialty?: NestedValue<Specialty>

    constructor(name?: string,
        cpf?: string,
        email?: string,
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
        genre?: string,
        crm?: string, specialty?: NestedValue<Specialty>) {

        super(name, cpf, email, phone, phone2, username,
            password, city, state, dateOfBirth, postalCode, address1, address2, addressComplement, country, genre)
        this.crm = crm
        this.specialty = specialty
        Object.setPrototypeOf(this, UserDoctorData.prototype)
    }
}


class Specialty {
    description!: string
}

export class UserAccRecoveryPasswdRequest {
    userEmail!: string
    userCpf!: string
}

export class UserAccRecoveryPasswd {
    token!: string
    newPassword!: string
}

class ExamDNA {
    exam?: string = ''
    doctor?: {
        crm?: string
    }
}