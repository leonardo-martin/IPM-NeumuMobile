import { api } from "./api.service"

import { timelineTestData } from "@pages/admin/profile/myNotes/data"

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