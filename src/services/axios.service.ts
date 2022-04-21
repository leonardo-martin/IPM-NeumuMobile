import { API_BASE_URL } from '@constants/uri'
import axios from 'axios'

export const getAPIClient = () => {

    const api = axios.create({
        baseURL: `${API_BASE_URL}`
    })

    api.interceptors.request.use(config => {
        return config
    })

    return api
}
