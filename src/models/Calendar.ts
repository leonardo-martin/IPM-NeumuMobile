import { CalendarEventWritable } from "react-native-calendar-events"
import { AppointmentDto } from "./Appointment"
import { PatientDiaryEntryDto } from "./Patient"

export interface EventCalendar extends CalendarEventWritable {
    title: string
}

export class CalendarEntryDto {
    date!: Date
    diaryEntry!: PatientDiaryEntryDto
    appointments!: Array<AppointmentDto>
}