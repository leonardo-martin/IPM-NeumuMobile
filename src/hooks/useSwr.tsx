import { AxiosRequestConfig } from 'axios'
import useSWR from 'swr'
import { api } from 'services/api.service'

export function useFetch<Data = any, Error = any>(url: string, config?: AxiosRequestConfig) {

    const { data, error, mutate } = useSWR<Data, Error>(url, async url => {
        const response = await api.get(url, config)

        return response.data
    })

    return { data, error, mutate }
}