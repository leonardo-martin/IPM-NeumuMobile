import { CalendarEntryDto } from "@models/Calendar"
import { CalendarRange } from "@ui-kitten/components"
import { AxiosResponse } from "axios"
import RNCalendarEvents, { AuthorizationStatus, Calendar, CalendarEventWritable, Options } from "react-native-calendar-events"
import { api } from "./api.service"
import { AppInfoService } from "./app-info.service"

export const listCalendars = async (): Promise<Calendar[]> => {
    let permissions
    let calendars: Calendar[] = []
    try {
        permissions = await RNCalendarEvents.checkPermissions()
        if (permissions !== 'authorized') {
            permissions = await RNCalendarEvents.requestPermissions()
        }
        if (permissions !== 'authorized') {
            throw 'Access calendar not authorized'
        }

        calendars = await RNCalendarEvents.findCalendars()
    } catch (e) {
        throw e
    }

    return calendars
}

export const addCalendarEvent = async (event: CalendarEventWritable, _calendar: Calendar, _title: string = AppInfoService.getAppName(), _options: Options = {}): Promise<string> => {
    let permissions: AuthorizationStatus
    let createdEventId: string = ''
    try {
        permissions = await RNCalendarEvents.checkPermissions()
        if (permissions !== 'authorized') {
            permissions = await RNCalendarEvents.requestPermissions()
        }

        if (permissions !== 'authorized') {
            throw 'Access calendar not authorized'
        }

        const newEvent = { ...event }
        if (_calendar) newEvent.calendarId = _calendar.id

        createdEventId = await RNCalendarEvents.saveEvent(_title, newEvent, _options)
    } catch (e) {
        throw e
    }
    return createdEventId
}

export const getPatientCalendarAsDoctor = async (patientId: string, range: CalendarRange<Date>): Promise<AxiosResponse<CalendarEntryDto[], any>> => {
    const params = new URLSearchParams()
    params.append('patientId', patientId)
    if (range.startDate)
        params.append('startDate', range.startDate.toISOString())
    if (range.endDate)
        params.append('endDate', range.endDate.toISOString())
    return await api.get('calendar/get-patient-calendar-as-doctor?' + params)
}