import { PatientProfileCreatorDto } from '@models/PatientProfileCreator'
import { UserData, UserDto, UserPatientData, UserRelatedIdsDto } from '@models/User'
import { AxiosResponse } from 'axios'
import { api } from './api.service'

interface User extends UserData {
    phone1: string
}

export const createUser = async (data: UserPatientData, _type: string = 'patient'): Promise<AxiosResponse> => {

    data = JSON.parse(JSON.stringify(data))

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

export const getUserDetails = async (): Promise<AxiosResponse<User, any>> => {
    return await api.get('user')
}

export const getUserRelatedIds = async (): Promise<AxiosResponse<UserRelatedIdsDto, any>> => {
    return await api.get('user/user-related-ids')
}

export const updateUser = async (data: UserDto | any): Promise<AxiosResponse<UserDto, any>> => {
    return await api.post('user/update-user', data)
}

export const deleteUserSelf = async (): Promise<AxiosResponse<UserDto, any>> => {
    return await api.delete('user')
}