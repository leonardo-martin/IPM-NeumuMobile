import axios from 'axios'
import { API_BASE_URL } from '@env'
import { AppStorage } from './app-storage.service'

const getToken = async () => {
    return await AppStorage.getUserToken()
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
        api.defaults.headers.common['Authorization']  = `Bearer ${token}`
    }

    return api
}
