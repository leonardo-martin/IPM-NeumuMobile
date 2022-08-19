import { Buffer } from '@models/Common'
import { DocumentDataDto, DocumentDto } from '@models/Document'
import { Base64 } from '@utils/base64'
import { AxiosResponse } from 'axios'
import { Platform } from 'react-native'
import DocumentPicker, { DocumentPickerOptions, DocumentPickerResponse } from 'react-native-document-picker'
import { SupportedPlatforms } from "react-native-document-picker/lib/typescript/fileTypes"
import RNFS from 'react-native-fs'
import { CameraOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { api } from "./api.service"
import { requestCameraPermission } from './permission.service'

const optionsImagePicker: CameraOptions = {
    ...__DEV__ ? {
        mediaType: 'mixed'
    } : {
        mediaType: 'photo',
        saveToPhotos: true,

    }
}

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
    ...__DEV__ ? {
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles]
    } : {
        allowMultiSelection: false,
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
    },
    transitionStyle: 'coverVertical'

}): Promise<DocumentPickerResponse[]> => {
    return await DocumentPicker.pick(_opts)
}

export const launchCameraFromDevice = async (options: CameraOptions = optionsImagePicker): Promise<ImagePickerResponse> => {
    let granted: boolean = (Platform.OS === 'android') ? await requestCameraPermission() : true

    if (granted) {
        const ret = await launchCamera(options)
        if (ret.errorCode) throw ret
        else return ret
    } else {
        throw 'Permission denied'
    }
}

export const launchImageLibraryFromDevice = async (options: CameraOptions = optionsImagePicker): Promise<ImagePickerResponse> => {
    let granted: boolean = (Platform.OS === 'android') ? await requestCameraPermission() : true

    if (granted) {
        const ret = await launchImageLibrary(options)
        if (ret.errorCode) throw ret
        else return ret
    } else {
        throw 'Permission denied'
    }

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

/**
 * 
 * @param arrayBuffer File Buffer
 * @param fileName File name along with its extension
 * @returns 
 */
export const saveFileToDevice = async (arrayBuffer: ArrayBuffer, fileName: string): Promise<{
    recorded: boolean, filePath: string | null
}> => {

    const directory = Platform.select({
        ios: RNFS.DocumentDirectoryPath,
        android: RNFS.DownloadDirectoryPath,
    });

    const FILE_PATH = `${directory}/${fileName}`
    try {
        await RNFS.writeFile(FILE_PATH, Base64.arrayBufferToBase64(arrayBuffer), 'base64')
        return { recorded: true, filePath: FILE_PATH }
    } catch (error) {
        console.error(error)
        return { recorded: false, filePath: null }
    }
}

export const readFileFromDevice = async (filePath: string) => {
    return await RNFS.readFile(filePath, 'base64')
}