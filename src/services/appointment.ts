import { CreateAppointment } from '@models/Appointment'
import { api } from './api'

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