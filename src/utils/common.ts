import { PatientProfileCreatorTypeEnum } from "models/PatientProfileCreator"
import { MutableRefObject } from "react"

export const matchMessage = (message: any) => {

    if (message != null || message != '')
        if (JSON.stringify(message).match('Cpf Already Registered') || JSON.stringify(message).match('Unauthorized')) {
            return 1
        } else if (JSON.stringify(message).match('Email Already Registered')) {
            return 2
        } else if (JSON.stringify(message).match('The provided CPF number is not a valid CPF number')) {
            return 3
        } else if (JSON.stringify(message).match('User email has not been verified')) {
            return 2
        }
    return 0
}

export const capitalizeFirstLetter = (text: string) => {

    var splitStr = text.toLowerCase().split(' ')
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    return splitStr.join(' ')
}

export const scrollToRef = (ref: MutableRefObject<any>, x?: number, y?: number) => {
    ref.current.scrollTo({
        x: x,
        y: y,
        animated: true
    })

}

export const extractFieldString = (value: string) => {
    const regExp = /\(\`([^)]+)\`\)/
    const response = regExp.exec(value)
    if (response) return response[1].toUpperCase()
    else return ''
}

export const getRelationPatient = (index: number) => {
    return {
        0: PatientProfileCreatorTypeEnum.PatientSelf,
        1: PatientProfileCreatorTypeEnum.PatientRelated,
        2: PatientProfileCreatorTypeEnum.MedicalDoctorNoProfile,
        3: PatientProfileCreatorTypeEnum.SpecialistNoProfile,
        4: PatientProfileCreatorTypeEnum.Other
    }[index]
}

export const getExamType = (index: number) => {
    return {
        0: 'clinical',
        1: 'genetic'
    }[index]
}

export const getGender = (index: number) => {
    return {
        0: 'male',
        1: 'female',
        2: 'none'
    }[index]
}
