import { _DATE_FROM_ISO_8601 } from "@constants/date"
import { TELENEUMU_CONTACT, TELENEUMU_SUBJECT } from '@constants/mail'
import { AscendingOrder } from "@models/Common"
import { PatientDiaryEntryDto } from "@models/Patient"
import { PatientProfileCreatorTypeEnum } from "@models/PatientProfileCreator"
import { TimelineItem } from "@models/Timeline"
import { CalendarRange, NativeDateService } from "@ui-kitten/components"
import { addMinutes } from 'date-fns'
import { MutableRefObject } from "react"
import { Linking } from "react-native"
import Toast from 'react-native-toast-message'

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
        } else if (JSON.stringify(message).match('Under age user must be verified by responsible')) {
            return 3
        } else if (JSON.stringify(message).match('User does not have permission to access the app')) {
            return 4
        }
        // Delete account error
        else if (JSON.stringify(message).match('All projects must be cancelled before deleting the account.')) {
            return 5
        } else if (JSON.stringify(message).match('All consults must be cancelled before deleting the account.')) {
            return 6
        } else if (JSON.stringify(message).match('Special user not found')) {
            return 7
        } else if (JSON.stringify(message).match('User not found')) {
            return 8
        } else if (JSON.stringify(message).match('Error when trying to storage user data or delete user')) {
            return 9
        }
    return 0
}

export const capitalizeFirstLetter = (text: string) => {

    let splitStr = text.toLowerCase().split(' ')
    for (let i = 0; i < splitStr.length; i++) {
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

export const sortByDate = (localeDateService: NativeDateService, a: Date | string, b: Date | string, order: AscendingOrder | undefined) => {

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
    Linking.openURL(`mailto:${TELENEUMU_CONTACT}?subject=${TELENEUMU_SUBJECT}`)
        .catch(() => {
            Toast.show({
                type: 'warning',
                text2: 'Erro desconhecido. Contate o administrador',
            })
        })
}

export const groupByDateTime = (localeDateService: NativeDateService, data: PatientDiaryEntryDto[]): TimelineItem => {

    let groups: TimelineItem = {}
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

export const orderByDateRange = (localeDateService: NativeDateService, range: CalendarRange<Date>, array: any[], _columnName?: string) => {

    if (range.startDate && !range.endDate)
        return array.filter((e: any) => localeDateService.parse(_columnName ? e[_columnName] : e, _DATE_FROM_ISO_8601) >= (range.startDate as Date))
    else if (range.startDate && range.endDate)
        return array.filter((e: any) => localeDateService.parse(_columnName ? e[_columnName] : e, _DATE_FROM_ISO_8601) >= (range.startDate as Date)
            && localeDateService.parse(_columnName ? e[_columnName] : e, _DATE_FROM_ISO_8601) < localeDateService.addDay((range.endDate as Date), 1))

    return array
}

/**
 * 
 * @param interval Intervalo de tempo em minutos (Default = 30)
 * @param startTime Minuto inicial (Default = 0)
 * @param endTime Hora final (Default = 24)
 * @returns string[...Date.toISOString]
 */
export const getTimesByInterval = (localeDateService: NativeDateService, interval: number = 30, startTime: number = 0, endTime: number = 24) => {

    let dates: string[] = []
    let date = localeDateService.today()
    date.setHours(0, 0, 0, 0)

    for (let i = 0; startTime < endTime * 60; i++) {
        startTime = startTime + interval
        let add = localeDateService.parse(addMinutes(date, startTime).toISOString(), _DATE_FROM_ISO_8601)
        dates.push(add.toISOString())
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

/**
 * Retorna o valor do timeblock para determinada Hora e Minuto em GMT
 * @param hourTime Hora
 * @param minuteTime Minuto
 * @returns number
 */
const calculateTimeBlock = (hourTime: number = 0, minuteTime: number = 0) => {
    const hourTimeBlock = (hourTime + 3) * 4 // GMT
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

/**
 * Função para calcular a idade de uma pessoa, tendo como base o dia de hoje ou outra data se desejar
 * @param stringDate String referente à data de nascimento da pessoa, no formato dd/mm/yyyy
 * @param _dateCompare Data a comparar (opcional) | Padrão: Hoje
 * @returns {}
 */
export const calcAge = (stringDate: string, _dateCompare: Date = new Date()): {
    years: number, months: number, days: number, formatted: string
} => {

    let yearNow = _dateCompare.getFullYear()
    let monthNow = _dateCompare.getMonth()
    let dateNow = _dateCompare.getDate()
    let dob = new Date(Number(stringDate.substring(6, 10)),
        Number(stringDate.substring(3, 5)) - 1,
        Number(stringDate.substring(0, 2))
    )

    let yearDob = dob.getFullYear()
    let monthDob = dob.getMonth()
    let dateDob = dob.getDate()
    let yearAge = yearNow - yearDob

    let monthAge = undefined
    let dateAge = undefined
    if (monthNow >= monthDob)
        monthAge = monthNow - monthDob
    else {
        yearAge--
        monthAge = 12 + monthNow - monthDob
    }

    if (dateNow >= dateDob)
        dateAge = dateNow - dateDob
    else {
        monthAge--;
        dateAge = 31 + dateNow - dateDob

        if (monthAge < 0) {
            monthAge = 11
            yearAge--
        }
    }

    let conjunction = ' e '
    if (yearAge > 0 && monthAge > 0 && dateAge > 0) conjunction = ', '
    else if (yearAge === 0 && monthAge === 0 && dateAge > 0) conjunction = ''
    else if (yearAge === 0 && monthAge > 0 && dateAge === 0) conjunction = ''

    let formatted = ((yearAge > 0) ? (yearAge === 1 ? (yearAge + ' ano') : (yearAge + ' anos')) : '') +
        ((monthAge > 0) ? (monthAge === 1 ? (conjunction + monthAge + ' mês') : (conjunction + monthAge + ' meses')) : '') +
        ((dateAge > 0) ? (dateAge === 1 ? (((yearAge > 0 || monthAge > 0) ? ' e ' : '') + dateAge + ' dia') : (((yearAge > 0 || monthAge > 0) ? ' e ' : '') + dateAge + ' dias')) : '')
    return {
        years: yearAge,
        months: monthAge,
        days: dateAge,
        formatted: formatted === '' ? '0' : formatted
    }

}

export const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return (
        parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    )
}

export const generateHash = (psLength: number) => {
    let chars = '0123456789'
    let hash = ''

    for (let i = 0; i <= psLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length)
        hash += chars.substring(randomNumber, randomNumber + 1)
    }

    return hash
}
