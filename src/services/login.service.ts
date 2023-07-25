import { UserAccRecoveryPasswd, UserAccRecoveryPasswdRequest } from '@models/User'
import { AxiosResponse } from 'axios'
import { api } from './api.service'

export const changePassReq = async (data: UserAccRecoveryPasswdRequest) => {

    const params = new URLSearchParams()
    params.append('userEmail', data.userEmail?.toLowerCase() || '')
    params.append('userCpf', data.userCpf ? encodeURIComponent(data.userCpf) : '')
    params.append('userRne', data.userRne || '')
    return await api.post('login/change-password-request?' + params, {})
}

export const changePass = async (data: UserAccRecoveryPasswd): Promise<AxiosResponse> => {

    const params = new URLSearchParams()
    params.append('token', encodeURIComponent(data.token))
    params.append('newPassword', encodeURIComponent(data.newPassword))
    return await api.post('login/change-password?token?' + params, {}).catch(e => e.response)
}
