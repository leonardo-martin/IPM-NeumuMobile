import { _DATE_FROM_ISO_8601 } from "@constants/date"
import toast from '@helpers/toast'
import { useDatepickerService } from "@hooks/useDatepickerService"
import { AscendingOrder } from "@models/Common"
import { PatientDiaryEntryDto } from "@models/Patient"
import { PatientProfileCreatorTypeEnum } from "@models/PatientProfileCreator"
import { TimelineItem } from "@models/Timeline"
import { CalendarRange } from "@ui-kitten/components"
import { addMinutes } from 'date-fns'
import { MutableRefObject } from "react"
import { Linking } from "react-native"

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

export const sortByNumber = (a: number, b: number) => {
    if (a < b) {
        return -1
    }
    if (a > b) {
        return 1
    }
    return 0
}

export const sortByDate = (a: Date | string, b: Date | string, order: AscendingOrder | undefined) => {

    const { localeDateService } = useDatepickerService()

    if (typeof a === 'string') {
        a = localeDateService.parse(a, _DATE_FROM_ISO_8601)
    }

    if (typeof b === 'string') {
        b = localeDateService.parse(b, _DATE_FROM_ISO_8601)
    }

    if (order === AscendingOrder.ASC)
        return a.getTime() - b.getTime()
    else if (order === AscendingOrder.DESC)
        return b.getTime() - a.getTime()

    return a.getTime() - b.getTime()
}

export const openMailTo = () => {
    Linking.openURL('mailto:contato@teleneumu.com.br?subject=Contato TeleNeuMu')
        .catch(() => {
            toast.warning({ message: 'Erro desconhecido. Contate o administrador', duration: 3000 })
        })
}

export const groupByDateTime = (data: PatientDiaryEntryDto[]): TimelineItem => {
    const { localeDateService } = useDatepickerService()

    var groups: TimelineItem = {}
    data.forEach(val => {
        val.date = typeof val.date === 'string' ? localeDateService.parse(val.date, _DATE_FROM_ISO_8601) : val.date
        if (val.date.toISOString() in groups) {
            groups[val.date.toISOString()].push(val.data)
        } else {
            groups[val.date.toISOString()] = new Array(val.data)
        }
    })

    return groups
}

export const orderByDateRange = (range: CalendarRange<Date>, array: any, _columnName?: string) => {

    const { localeDateService } = useDatepickerService()

    if (range.startDate && !range.endDate)
        return array.filter((e: any) => localeDateService.parse(_columnName ? e[_columnName] : e, _DATE_FROM_ISO_8601) >= (range.startDate as Date)
            && localeDateService.parse(_columnName ? e[_columnName] : e, _DATE_FROM_ISO_8601) <= localeDateService.addDay((range.startDate as Date), 1))
    else if (range.startDate && range.endDate)
        return array.filter((e: any) => localeDateService.parse(_columnName ? e[_columnName] : e, _DATE_FROM_ISO_8601) >= (range.startDate as Date)
            && localeDateService.parse(_columnName ? e[_columnName] : e, _DATE_FROM_ISO_8601) <= localeDateService.addDay((range.endDate as Date), 1))

    return array
}

/**
 * 
 * @param interval Intervalo de tempo em minutos (Default = 30)
 * @param startTime Minuto inicial (Default = 0)
 * @param endTime Hora final (Default = 24)
 * @returns string[...Date.toISOString]
 */
export const getTimesByInterval = (interval: number = 30, startTime: number = 0, endTime: number = 24) => {

    const { localeDateService } = useDatepickerService()

    let dates: string[] = []
    let date = localeDateService.today()
    date.setHours(0, 0, 0, 0)

    for (var i = 0; startTime < endTime * 60; i++) {
        startTime = startTime + interval
        dates.push(addMinutes(date, startTime).toISOString())
    }

    return dates
}

export const filterBy = (item: any, query: string, _fieldName?: string) => {

    if (item)
        if (_fieldName)
            return item[_fieldName].toLowerCase().includes(query.toLowerCase())
        else
            return item.toLowerCase().includes(query.toLowerCase())
    else return null
}

export const getTimeBlocksByTime = (date: Date = new Date()) => {
    return calculateTimeBlock(date.getHours(), date.getMinutes())
}

const calculateTimeBlock = (hourTime: number = 0, minuteTime: number = 0) => {
    const hourTimeBlock = hourTime * 4
    const minuteTimeBlock = Math.floor(minuteTime / 15)
    const timeBlock = hourTimeBlock + minuteTimeBlock
    return timeBlock
}

export const toInitials = (str: string | undefined) =>
    str ? str.split(" ")
        .map(c => c.charAt(0).toUpperCase())
        .join("")
        .concat(str.charAt(1).toUpperCase())
        .substring(0, 2) : ''