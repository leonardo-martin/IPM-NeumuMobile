import { UserAccRecoveryPasswd, UserAccRecoveryPasswdRequest } from '@models/User'
import { api } from './api'

export const changePassReq = async (data: UserAccRecoveryPasswdRequest) => {

    return await api.post(`/login/change-password-request?userEmail=${encodeURIComponent(data.userEmail)}&userCpf=${encodeURIComponent(data.userCpf)}`, {})
}

export const changePass = async (data: UserAccRecoveryPasswd) => {

    return await api.post(`/login/change-password?token=${encodeURIComponent(data.token)}&newPassword=${encodeURIComponent(data.newPassword)}`, {})
}
