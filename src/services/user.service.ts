import { PatientProfileCreatorDto } from '@models/PatientProfileCreator'
import { UserData, UserDto, UserPatientData, UserRelatedIdsDto, VerifyUniqueUserKeysDto } from '@models/User'
import { setProfilePic } from '@store/ducks/profile'
import { Base64 } from '@utils/base64'
import { getDocumentType, getEntityType } from '@utils/entity'
import { AxiosResponse } from 'axios'
import { AppDispatch } from 'store'
import { api } from './api.service'
import { userGetDocument, userGetDocumentFile } from './document.service'

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
        createdPatientProfileId: patientId,
        data: JSON.stringify(creator?.data)
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

export const getProfilePicture = (userId: number) => async (dispatch: AppDispatch) => {
    try {
        const responseDoc = await userGetDocument({
            entityId: userId,
            entityType: getEntityType('user'),
            documentType: getDocumentType('user')
        })
        if (responseDoc.data && responseDoc.status === 201) {
            if (responseDoc.data[0]) {
                const responseDocData = await userGetDocumentFile(responseDoc.data[0].id)
                const base64 = Base64.arrayBufferToBase64(responseDocData.data.data)
                dispatch(setProfilePic({ base64, id: responseDoc.data[0].id }))
            }
        }
    } catch (error) {
        throw error
    }
}

export const verifyUniqueData = async (data: VerifyUniqueUserKeysDto) => {
    return await api.post('user/verify-unique-data', data)
}