import axios from 'axios'
import { API_BASE_URL } from '@env'
import AsyncStorage from '@react-native-community/async-storage'

const getToken = async () => {
    const token = await AsyncStorage.getItem('@RNAuth:token')
    return token
}

export const getAPIClient = () => {

    const api = axios.create({
        baseURL: `${API_BASE_URL}`
    })

    api.interceptors.request.use(config => {
        return config
    })

    const token = getToken()
    if (token) {
        api.defaults.headers['Authorization'] = `Bearer ${token}`
    }

    return api
}
