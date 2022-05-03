import RNCalendarEvents, { AuthorizationStatus, Calendar, CalendarEventWritable, Options } from "react-native-calendar-events"

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

export const addCalendarEvent = async (event: CalendarEventWritable, _calendar: Calendar, _title: string = 'TeleNeuMu', _options: Options = {}): Promise<string> => {
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