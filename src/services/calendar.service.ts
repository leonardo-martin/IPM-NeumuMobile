import CalendarModule, { CalendarEventDTO } from "@models/calendar"

export class CalendarEventService {

    static save = async (calendarEvent: CalendarEventDTO): Promise<number> => {
        return await CalendarModule.createCalendarEvent(calendarEvent)
    }

    static edit = async (calendarId: number, calendarEventUp: CalendarEventDTO): Promise<void> => {

    }

    static delete = async (calendarId: number): Promise<void> => {

    }
}
