import { AppointmentAvailabilityDTO, AppointmentAvailabilityParams, CreateAppointment } from '@models/Appointment'
import { AxiosResponse } from 'axios'
import { api } from './api.service'

interface QueryParameters {
    confirmedByDoctor?: boolean | undefined
    filterStartDate?: string | undefined
    filterEndDate?: string | undefined
}

export const createAppointment = async (data: CreateAppointment | undefined) => {

    return await api.post('appointment/create-appointment', data)
}

export const getAppointments = async (queryParameters?: QueryParameters) => {

    return await api.get('appointment/get-appointment-list-patient', {
        params: {
            confirmedByDoctor: queryParameters?.confirmedByDoctor ? "true" : "false",
            filterStartDate: queryParameters?.filterStartDate,
            filterEndDate: queryParameters?.filterEndDate
        }
    })
}

export const doctorCreateAppointmentAvailability = async (data: AppointmentAvailabilityParams): Promise<AxiosResponse<AppointmentAvailabilityDTO[], any>> => {

    const params = new URLSearchParams()
    params.append('dayOfWeek', data.dayOfWeek.toString())
    params.append('startTime', data.startTime.toString())
    params.append('endTime', data.endTime.toString())

    console.log('api', api.defaults.headers)
    return await api.post('appointment-availability/doctor-create-appointment-availability-block?' + params)
}