import { DocumentDto } from '@models/Document'
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