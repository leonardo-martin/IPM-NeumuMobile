import { Buffer } from '@models/Common'
import { DocumentDataDto, DocumentDto } from '@models/Document'
import { Base64 } from '@utils/base64'
import { AxiosResponse } from 'axios'
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native'
import DocumentPicker, { DocumentPickerOptions, DocumentPickerResponse } from 'react-native-document-picker'
import { SupportedPlatforms } from "react-native-document-picker/lib/typescript/fileTypes"
import RNFS from 'react-native-fs'
import { CameraOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { api } from "./api.service"
import { requestCameraPermission } from './permission.service'
import { AppInfoService } from './app-info.service'

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

    const isEmulator = await AppInfoService.isEmulator()
    const directory = Platform.select({
        ios: RNFS.DocumentDirectoryPath,
        android: isEmulator ? `${RNFS.ExternalDirectoryPath}/${AppInfoService.getAppName()}` : `${RNFS.DownloadDirectoryPath}/${AppInfoService.getAppName()}`,
    }) ?? ''

    const PATH = `${directory}/docs`
    try {
        if (!(await RNFS.exists(PATH))) {
            await RNFS.mkdir(PATH)
        }
        const FILE_PATH = `${PATH}/${fileName}`
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

export const requestPermission = async (version: number): Promise<boolean> => {
    if (Platform.OS === 'android' && version < 13) {
        const {
            'android.permission.READ_EXTERNAL_STORAGE': readGranted,
            'android.permission.WRITE_EXTERNAL_STORAGE': writeGranted
        } = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE])

        if (readGranted !== PermissionsAndroid.RESULTS.GRANTED || writeGranted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Read and write permissions have not been granted');
            Alert.alert(
                'Configurações desabilitadas',
                'Para editar, clique em "Ir para Configurações"',
                [
                    {
                        text: 'Ir para Configurações',
                        style: 'destructive',
                        onPress: () => Linking.openSettings()
                    },
                    {
                        text: 'Não',
                        style: 'cancel'
                    }
                ]
            )
            return false
        } else {
            return true
        }
    } else {
        return true
    }
}