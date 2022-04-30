import { VisitAddress, VisitAddressDTO } from "@models/VisitAddress"
import { AxiosResponse } from "axios"
import { api } from "./api.service"

export const createVisitAddress = async (data: VisitAddress): Promise<AxiosResponse<VisitAddressDTO, any>> => {
    return await api.post('visit-address/create-visit-address', data)
}

export const getVisitAddressListByDoctorId = async (doctorId: string): Promise<AxiosResponse<VisitAddressDTO[], any>> => {
    const params = new URLSearchParams()
    params.append('doctorId', doctorId)
    return await api.get('visit-address?' + params)
}

export const updateVisitAddress = async (data: VisitAddressDTO): Promise<AxiosResponse<VisitAddressDTO, any>> => {
    return await api.put('visit-address/update-visit-address', data)
}