import { UserAccRecoveryPasswd, UserAccRecoveryPasswdRequest } from '@models/User'
import { AxiosResponse } from 'axios'
import { api } from './api.service'

export const changePassReq = async (data: UserAccRecoveryPasswdRequest) => {

    return await api.post(`/login/change-password-request?userEmail=${encodeURIComponent(data.userEmail)}&userCpf=${encodeURIComponent(data.userCpf)}`, {})
}

export const changePass = async (data: UserAccRecoveryPasswd) : Promise<AxiosResponse> => {

    return await api.post(`/login/change-password?token=${encodeURIComponent(data.token)}&newPassword=${encodeURIComponent(data.newPassword)}`, {})
    .catch(e => e.response)
}
