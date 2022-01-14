export class PatientProfileCreatorDto {
    createdPatientProfileId!: string | number
    patientProfileCreatorTypeId!: PatientProfileCreatorTypeEnum | number | undefined
    data!: JSONObject
}

export class PatientProfileCreatorPatientRelatedDto extends PatientProfileCreatorDto {
    name!: string
    cpf!: string
    email!: string
    phone!: string
}

export enum PatientProfileCreatorTypeEnum {
    Other = "0",
    PatientSelf = "1",
    PatientRelated = "2",
    MedicalDoctorNoProfile = "3",
    MedicalDoctor = "4",
    SpecialistNoProfile = "5",
    Specialist = "6",
}


interface JSONObject {
    [key: string]: any
}
