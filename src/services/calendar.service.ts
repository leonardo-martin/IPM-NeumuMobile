import RNCalendarEvents, { AuthorizationStatus, Calendar, CalendarEventWritable, Options } from "react-native-calendar-events"
import { api } from "./api.service"
import { timelineTestData } from "@pages/admin/profile/myNotes/data"

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

export const addCalendarEvent = async (event: CalendarEventWritable, _calendar: Calendar, _title: string = 'TeleNeumu', _options: Options = {}): Promise<string> => {
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

export const getPatientCalendar = async (startDate: string | undefined, endDate: string | undefined, patientId: string) => {

    return await {
        data: timelineTestData
    }

    // let params = {
    //     startDate,
    //     endDate,
    //     patientId
    // }

    // if(!startDate) delete params['startDate']
    // if(!endDate) delete params['endDate']

    // return await api.get('/calendar/get-patient-calendar', {
    //     params
    // })
}