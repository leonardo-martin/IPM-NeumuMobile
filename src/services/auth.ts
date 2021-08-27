import { SignInData } from '../models/User'
import { api } from './api'

export const signInRequest = async (requestData: SignInData) => {
    return await api.post('auth', requestData)
}