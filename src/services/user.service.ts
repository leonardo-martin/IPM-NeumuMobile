import { UserPatientData } from '@models/User'
import { PatientProfileCreatorDto } from '@models/PatientProfileCreator'
import { api } from './api.service'
import { AxiosResponse } from 'axios'
import { AppDispatch } from '@store/index'
import { setProfile } from '@store/ducks/profile'

export const createUser = async (data: UserPatientData, _type: string = 'patient'): Promise<AxiosResponse> => {

    data = JSON.parse(JSON.stringify(data).replace('cns', 'susnumber').replace('genre', 'sex'))

    return await api.post(`user/create-${_type}`, data)
        .catch(error => {
            if (error.response) {
                return error.response
            }
            throw error
        })

}

export const createPatientProfileCreator = async (patientId: number, creator?: PatientProfileCreatorDto): Promise<AxiosResponse> => {

    const creatorReq = {
        ...creator,
        createdPatientProfileId: patientId
    }

    creatorReq.patientProfileCreatorTypeId = Number(creator?.patientProfileCreatorTypeId)

    return await api.post('patient-profile-creator', creatorReq)
}

export const getUserDetails = () => (dispatch: AppDispatch): Promise<any> => {
    return api.get('user')
        .then(async (res: AxiosResponse<any>) => {
            if (res.data) {
                dispatch(setProfile(res.data))
            }
        })
        .catch((error) => {
            if (error.response) {
                return error.response
            }
            throw error
        })

}