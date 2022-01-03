/**
* This exposes the native CalendarModule module as a TS module.
*/
import { NativeModules } from 'react-native'
const { CalendarModule } = NativeModules

export type CalendarEventDTO = {
    readonly title: string,
    readonly description: string,
    readonly location: string,
    readonly dtStart: string,
    readonly dtEnd: string,
    readonly allDay: boolean
}

interface CalendarInterface {
    createCalendarEvent(calendarEvent: CalendarEventDTO): Promise<number>
}
export default CalendarModule as CalendarInterface