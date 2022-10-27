import { AuthenticationPayload, LoginDto } from '@models/User'
import { login } from '@store/ducks/auth'
import { AppDispatch } from '@store/index'
import { cleanNumberMask } from '@utils/mask'
import { AxiosResponse } from 'axios'
import { validate as validateCPF } from 'gerador-validador-cpf'
import { VersionTestDto } from 'models/VersionTest'
import Keychain from 'react-native-keychain'
import { api } from './api.service'
import { AppStorage } from './app-storage.service'

const _optionsKeychain: Keychain.Options = {
    service: 'sec_login', storage: Keychain.STORAGE_TYPE.RSA
}

export const authLogin = (auth: LoginDto, _rememberAcess?: boolean) => (dispatch: AppDispatch): Promise<any> => {
    return api.post('auth', {
        ...auth,
        username: validateCPF(auth.username) ? cleanNumberMask(auth.username) : auth.username
    })
        .then(async (res: AxiosResponse<AuthenticationPayload>) => {
            if (res.data.accessToken) {

                await Keychain.resetGenericPassword(_optionsKeychain)
                await AppStorage.removeItem('REMEMBER_ACCESS')

                if (_rememberAcess) {
                    await Keychain.setGenericPassword(auth.username, auth.password, _optionsKeychain)
                    await AppStorage.setItem('REMEMBER_ACCESS', 'true')
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

export const getVersionTest = (version: string): Promise<AxiosResponse<VersionTestDto>> => {
    const params = new URLSearchParams()
    params.append('version', version)

    return api.post('auth/get-version-test?' + params)
}