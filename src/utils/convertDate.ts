import { DateFnsService } from '@ui-kitten/date-fns'

const dateService = new DateFnsService()

const _DEFAULT_FORMAT_DATETIME = 'dd-MM-YYYY HH:mm:ss'

const getFormat = (format: string | undefined) => {
    return format ? format : _DEFAULT_FORMAT_DATETIME
}

export const formatDateToString = (date: Date, format?: string) => {
    return dateService.format(date, getFormat(format))
}