import { AuthenticationPayload, SignInData } from '@models/User'
import { login } from '@store/ducks/auth'
import { AppDispatch } from '@store/index'
import { AxiosResponse } from 'axios'
import Keychain from 'react-native-keychain'
import { api } from './api.service'
import { AppStorage } from './app-storage.service'

const _optionsKeychain: Keychain.Options = {
    service: 'sec_login', storage: Keychain.STORAGE_TYPE.RSA
}

export const authLogin = (authentication: SignInData, _rememberAcess?: boolean) => (dispatch: AppDispatch): Promise<any> => {
    return api.post('auth', authentication)
        .then(async (res: AxiosResponse<AuthenticationPayload>) => {
            if (res.data.accessToken) {

                if (_rememberAcess) {
                    await Keychain.setGenericPassword(authentication.username, authentication.password, _optionsKeychain)
                    await AppStorage.setItem('REMEMBER_ACCESS', 'true')

                } else {
                    await Keychain.resetGenericPassword(_optionsKeychain)
                    await AppStorage.removeItem('REMEMBER_ACCESS')
                }

                api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
                dispatch(login(res.data))
            }
        })
        .catch((error) => {
            if (error.response) {
                return error.response
            }
            throw error
        })

}