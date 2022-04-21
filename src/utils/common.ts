import { MutableRefObject } from "react"
import { PatientProfileCreatorTypeEnum } from "@models/PatientProfileCreator"
import { AscendingOrder } from "@models/Common"
import { Linking } from "react-native"
import toast from '@helpers/toast'

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

export const getRelationPatient = (index: number): string | undefined => {
    return {
        0: PatientProfileCreatorTypeEnum.PatientSelf,
        // 1: PatientProfileCreatorTypeEnum.PatientRelated,
        // 2: PatientProfileCreatorTypeEnum.MedicalDoctorNoProfile,
        // 3: PatientProfileCreatorTypeEnum.SpecialistNoProfile,
        1: PatientProfileCreatorTypeEnum.Other
    }[index]
}

export const getRelationPastExams = (index: number): string | undefined => {
    return {
        0: 'Confirmado DFEU 1',
        1: 'Confirmado DFEU 2',
        2: 'Não Confirmado DFEU',
        3: 'Resultado Pendente',
        4: 'Não Testado'
    }[index]
}

export const getExamType = (index: number): string | undefined => {
    return {
        0: 'clinical',
        1: 'genetic'
    }[index]
}

export const getGender = (index: number): string | undefined => {
    return {
        0: 'male',
        1: 'female',
        2: 'none'
    }[index]
}

export const sortByStringField = (a: any, b: any, _fieldName?: string) => {

    var nameA
    var nameB

    if (_fieldName) {
        nameA = typeof a[_fieldName] === 'string' ? a[_fieldName].toUpperCase() : a[_fieldName]
        nameB = typeof b[_fieldName] === 'string' ? b[_fieldName].toUpperCase() : b[_fieldName]
    } else {
        nameA = a
        nameB = b
    }
    if (nameA < nameB)
        return -1
    else if (nameA > nameB)
        return 1
    return 0

}

export const sortByDate = (a: Date, b: Date, order: AscendingOrder | undefined) => {

    if (order === AscendingOrder.ASC)
        return a.getTime() - b.getTime()
    else if (order === AscendingOrder.DESC)
        return b.getTime() - a.getTime()

    return a.getTime() - b.getTime()
}

export const openMailTo = () => {
    Linking.openURL('mailto:contato@teleneumu.com.br?subject=Contato TeleNeumu')
        .catch(() => {
            toast.warning({ message: 'Erro desconhecido. Contate o administrador', duration: 3000 })
        })
}