import CalendarModule, { CalendarEventDTO } from "@models/calendar"
import { api } from "./api.service"

import { timelineTestData } from "@pages/admin/profile/myNotes/data"

export class CalendarEventService {

    static save = async (calendarEvent: CalendarEventDTO): Promise<number> => {
        return await CalendarModule.createCalendarEvent(calendarEvent)
    }

    static edit = async (calendarId: number, calendarEventUp: CalendarEventDTO): Promise<void> => {

    }

    static delete = async (calendarId: number): Promise<void> => {

    }
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