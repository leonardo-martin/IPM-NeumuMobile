import { AppointmentAvailabilityDTO, AppointmentAvailabilityHelper, AppointmentAvailabilityParams, AppointmentAvailabilityWithBookedParams, AppointmentDto, CreateAppointment } from '@models/Appointment'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { api } from './api.service'

interface QueryParameters {
    confirmedByDoctor?: boolean | undefined
    filterStartDate?: string | undefined
    filterEndDate?: string | undefined
}

export const createAppointment = async (data: CreateAppointment | undefined): Promise<AxiosResponse<any, any>> => {

    return await api.post('appointment/create-appointment', data).catch((error) => {
        if (error.response) {
            return error.response
        }
        throw error
    })
}

export const getAppointmentListPatient = async (queryParameters?: QueryParameters, config?: AxiosRequestConfig): Promise<AxiosResponse<AppointmentDto[], any>> => {

    return await api.get('appointment/get-appointment-list-patient', {
        params: {
            confirmedByDoctor: queryParameters?.confirmedByDoctor ?? null,
            filterStartDate: queryParameters?.filterStartDate,
            filterEndDate: queryParameters?.filterEndDate
        },
        ...config
    })
}

export const getAppointmentListDoctor = async (queryParameters?: QueryParameters, config?: AxiosRequestConfig): Promise<AxiosResponse<AppointmentDto[], any>> => {

    return await api.get('appointment/get-appointment-list-doctor', {
        params: {
            confirmedByDoctor: queryParameters?.confirmedByDoctor ?? null,
            filterStartDate: queryParameters?.filterStartDate,
            filterEndDate: queryParameters?.filterEndDate
        },
        ...config
    })
}

export const doctorConfirmAppointment = async (appointmentId: string | number): Promise<AxiosResponse<AppointmentDto[], any>> => {

    const params = new URLSearchParams()
    params.append('appointmentId', appointmentId.toString())
    return await api.get('appointment/doctor-confirm-appointment?' + params)
}

export const doctorDeleteAppointment = async (appointmentId: string | number): Promise<AxiosResponse<AppointmentDto[], any>> => {

    const params = new URLSearchParams()
    params.append('appointmentId', appointmentId.toString())
    return await api.delete('appointment/doctor-delete-appointment?' + params)
}

export const patientDeleteAppointment = async (appointmentId: string | number): Promise<AxiosResponse<AppointmentDto[], any>> => {

    const params = new URLSearchParams()
    params.append('appointmentId', appointmentId.toString())
    return await api.delete('appointment/patient-delete-appointment?' + params)
}

export const doctorCreateAppointmentAvailability = async (data: AppointmentAvailabilityParams): Promise<AxiosResponse<AppointmentAvailabilityDTO[], any>> => {

    const params = new URLSearchParams()
    params.append('dayOfWeek', data.dayOfWeek.toString())
    params.append('startTime', data.startTime.toString())
    params.append('endTime', data.endTime.toString())

    return await api.post('appointment-availability/doctor-create-appointment-availability-block?' + params)
}

export const getAppointmentAvailabilityListSummaryByDoctorId = async (doctorId: number): Promise<AxiosResponse<{
    [k: string]: number[]
}, any>> => {

    const params = new URLSearchParams()
    params.append('doctorId', doctorId.toString())

    return await api.get('appointment-availability/get-doctor-appointment-availability-list-summary?' + params)
}

export const doctorDeleteAppointmentAvailabilityBlock = async (data: AppointmentAvailabilityParams): Promise<AxiosResponse<AppointmentAvailabilityDTO[], any>> => {
    const params = new URLSearchParams()
    params.append('dayOfWeek', data.dayOfWeek.toString())
    params.append('startTime', data.startTime.toString())
    params.append('endTime', data.endTime.toString())

    return await api.post('appointment-availability/doctor-delete-appointment-availability-block?' + params)
}

export const getAppointmentAvailabilityWithBookedAppointments = async (data: AppointmentAvailabilityWithBookedParams): Promise<AxiosResponse<AppointmentAvailabilityHelper[], any>> => {

    const params = new URLSearchParams()
    params.append('doctorId', data.doctorId?.toString() ?? '')
    params.append('startTime', data.startTime.toString())
    params.append('endTime', data.endTime.toString())

    return await api.get('appointment-availability/get-appointment-availability-with-booked-appointments?' + params)
}