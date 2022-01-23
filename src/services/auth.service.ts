import { SignInData } from '@models/User'
import { api } from './api.service'

export const signInRequest = async (requestData: SignInData) => {
    return await api.post('auth', requestData)
        .catch(error => {
            if (error.response) {
                throw error.response
            }
            throw error
        })
}