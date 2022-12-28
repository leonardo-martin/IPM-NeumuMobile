import { RelationshipPatient } from "@models/PatientProfileCreator"

export const creatorRelationship: RelationshipPatient[] = [
    "Amigo",
    "Cuidador",
    "Familiar",
    "Tutor Legal",
    // "Profissional de Saúde"
]

export const profileCreator = ['Paciente', 'Outro']

export const typeOfDocuments = [
    {
        value: 0,
        label: 'CPF'
    },
    // {
    //     value: 1,
    //     label: 'RG'
    // },
    {
        value: 2,
        label: 'RNM'
    }
]