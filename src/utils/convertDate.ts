import { DateFnsService } from '@ui-kitten/date-fns'

const dateService = new DateFnsService()

const _DATE_FROM_ISO_8601 = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
const _DEFAULT_FORMAT_DATE = 'dd/MM/YYYY'
const _DEFAULT_FORMAT_DATETIME = 'dd/MM/YYYY HH:mm:ss b'
const _DEFAULT_FORMAT_TIME = ' HH:mm:ss b'

const getFormatDate = (format: string | undefined) => {
    return format ? format : _DEFAULT_FORMAT_DATE
}

const getFormatDateTime = (format: string | undefined) => {
    return format ? format : _DEFAULT_FORMAT_DATETIME
}

const getFormatTime = (format: string | undefined) => {
    return format ? format : _DEFAULT_FORMAT_TIME
}

export const formatDateTimeToString = (date: Date, format?: string) => {
    return dateService.format(date, getFormatDateTime(format))
}

export const formatDateToString = (date: Date, format?: string) => {
    return dateService.format(date, getFormatDate(format))
}

export const formatTimeToString = (date: Date, format?: string) => {
    return dateService.format(date, getFormatTime(format))
}

export const formatDateFromISOToString = (date: string) => {
    return formatDateToString(dateService.parse(date, _DATE_FROM_ISO_8601))
}