import { Buffer } from '@models/Common'
import { DocumentDataDto, DocumentDto } from '@models/Document'
import { AxiosResponse } from 'axios'
import DocumentPicker, { DocumentPickerOptions, DocumentPickerResponse } from 'react-native-document-picker'
import { SupportedPlatforms } from "react-native-document-picker/lib/typescript/fileTypes"
import { api } from "./api.service"

export const uploadUserFile = async (data: FormData): Promise<AxiosResponse<DocumentDto, any>> => {
    return await api.post('document/user/upload-file', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => {
            return data
        }
    })
}

export const uploadTutorFile = async (data: FormData, patientCpf: string, tutorCpf: string) => {

    const params = new URLSearchParams()
    params.append('patientCpf', patientCpf)
    params.append('tutorCpf', tutorCpf)

    return await api.post('tutor-document?' + params, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        transformRequest: (content) => {
            return content
        }
    }).catch(error => {
        if (error.response) {
            return error.response
        }
        throw error
    })
}

export const getFileFromDevice = async (_opts: DocumentPickerOptions<SupportedPlatforms> | undefined = {
    presentationStyle: 'fullScreen',
    allowMultiSelection: false,
    type: [DocumentPicker.types.pdf, DocumentPicker.types.images]
}): Promise<DocumentPickerResponse[]> => {
    return await DocumentPicker.pick(_opts)
}

export const fileToBlob = async (uri: string) => {
    const fetchResponse = await fetch(uri)
    return await fetchResponse.blob()
}

export const doctorGetDocumentData = async (data: DocumentDataDto): Promise<AxiosResponse<DocumentDto[], any>> => {
    return await api.post('document/doctor/get-document-data', data)
}

export const doctorGetDocumentFile = async (patientId: string | number, documentId: string | number): Promise<AxiosResponse<Buffer, any>> => {

    const params = new URLSearchParams()
    params.append('patientId', patientId.toString())
    params.append('documentId', documentId.toString())

    return await api.get('document/doctor/get-document-file?' + params)
}

export const userGetDocumentFile = async (documentId: string | number): Promise<AxiosResponse<Buffer, any>> => {

    const params = new URLSearchParams()
    params.append('documentId', documentId.toString())

    return await api.get('document/user/get-document-file?' + params)
}

export const userGetDocument = async (data: DocumentDataDto): Promise<AxiosResponse<DocumentDto[], any>> => {
    return await api.post('document/user/get-document-data', data)
}

export const userDelete = async (documentId: string | number): Promise<AxiosResponse<DocumentDto[], any>> => {
    const params = new URLSearchParams()
    params.append('documentId', documentId.toString())
    return await api.get('document/user/delete?' + params)
}