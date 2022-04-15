import { api } from "./api.service"
import DocumentPicker, { DocumentPickerOptions, DocumentPickerResponse } from 'react-native-document-picker'
import { SupportedPlatforms } from "react-native-document-picker/lib/typescript/fileTypes"

// TODO
export const uploadFileUser = async (data: any) => {
    return await api.post('/document/user/upload-file', data)
}

export const getFileFromDevice = async (_opts: DocumentPickerOptions<SupportedPlatforms> | undefined = {
    presentationStyle: 'fullScreen',
    allowMultiSelection: false,
}): Promise<DocumentPickerResponse[]> => {
    return await DocumentPicker.pick(_opts)
}