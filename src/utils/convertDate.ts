import moment from 'moment-timezone'

export const convertToTimezone = (date: string, timezone: string) => {
    return moment(date).tz(timezone).format()
}

export const dateFormatToString = (date: Date | string | undefined) => {
    return `${moment(date).format('DD-MM-YYYY')} - ${moment(date).format('HH:mm')}`
}