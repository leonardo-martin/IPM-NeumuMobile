import { JSONObject } from "./Common"

export class PatientProfileCreatorDto {
    createdPatientProfileId!: string | number
    patientProfileCreatorTypeId!: PatientProfileCreatorTypeEnum | number | undefined
    data!: JSONObject | string | any
    responsibleEmail?: string;
}

export class PatientProfileCreatorPatientRelatedDto extends PatientProfileCreatorDto {
    name!: string
    cpf!: string
    email!: string
    phone!: string
}

export enum PatientProfileCreatorTypeEnum {
    Other = "0",
    PatientSelf = "1"
}

export enum ERelationship {
    Amigo,
    Cuidador,
    Familiar,
    "Tutor Legal",
    "Profissional de Saúde"
}

export type RelationshipPatient = "Amigo" | "Cuidador" | "Familiar" | "Tutor Legal" | "Profissional de Saúde"
