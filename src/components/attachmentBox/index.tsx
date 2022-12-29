import { FileDto } from '@models/Document'
import { getFileFromDevice, launchCameraFromDevice, launchImageLibraryFromDevice, saveFileToDevice, userGetDocumentFile } from '@services/document.service'
import { Icon, Text, useStyleSheet } from '@ui-kitten/components'
import { generateHash } from '@utils/common'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Alert, Platform, TouchableOpacity, View, PermissionsAndroid } from 'react-native'
import Toast from 'react-native-toast-message'
import { AppInfoService } from 'services/app-info.service'
import { attachBoxStyle } from './style'

interface AttachmentBoxProps {
    setFile: React.Dispatch<React.SetStateAction<FileDto[] | undefined>>
    setFileName: React.Dispatch<React.SetStateAction<string | undefined>>
    fileName?: string
    documentId?: number
    disabled?: boolean
    isNew?: boolean
}

const AttachmentBoxComponent: FC<AttachmentBoxProps> = ({ ...props }): ReactElement => {

    const { disabled, fileName, documentId, setFile, setFileName, isNew } = props
    const styles = useStyleSheet(attachBoxStyle)
    const [docId, setDocId] = useState<number | undefined>(undefined)

    useEffect(() => {
        setDocId(documentId)
    }, [documentId])

    const openFolder = async () => {
        try {
            const response = await getFileFromDevice()
            if (response) {
                setFile([{
                    uri: response[0].uri,
                    type: response[0].type,
                    fileName: response[0].name,
                    size: response[0].size
                }])
                setFileName(`D_${generateHash(16)}.${response[0].name?.split('.')[1] || ''}`)
            }

        } catch (err: any) {
            console.error(err)
        }
    }

    const openLibrary = async () => {
        try {
            const response = await launchImageLibraryFromDevice()
            if (response.assets) {
                let hash = generateHash(16)
                setDocId(Number(hash))
                setFile([{
                    uri: response.assets[0].uri || '',
                    type: response.assets[0].type || '',
                    fileName: response.assets[0].fileName || '',
                    size: response.assets[0].fileSize || null
                }])
                setFileName(`IMG_${hash}.${response.assets[0].fileName?.split('.')[1] || ''}`)
            }
        } catch (err: any) {
            console.error(err)
            Toast.show({
                type: 'danger',
                text2: 'Ocorreu um erro ao abrir a biblioteca',
            })
        }
    }

    const openCamera = async () => {
        try {
            const response = await launchCameraFromDevice()
            if (response.assets) {
                let hash = generateHash(16)
                setDocId(Number(hash))
                setFile([{
                    uri: response.assets[0].uri || '',
                    type: response.assets[0].type || '',
                    fileName: response.assets[0].fileName || '',
                    size: response.assets[0].fileSize || null
                }])
                setFileName(`DCIM_${hash}.${response.assets[0].fileName?.split('.')[1] || ''}`)
            }
        } catch (err: any) {
            console.error(err)
            Toast.show({
                type: 'danger',
                text2: 'Ocorreu um erro ao abrir a câmera',
            })
        }
    }

    const download = async () => {
        let bOk = false
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: AppInfoService.getAppName() + " desejar acessar o armazenamento.",
                    message: "Deseja permitir que o aplicativo acesse o armazenamento?",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Sim"
                })
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                bOk = true
            }
        } else {
            bOk = true
        }

        if (bOk) {
            Alert.alert(
                'Deseja efetuar o download do arquivo?',
                'O arquivo será baixando em background e avisaremos quando estiver concluído',
                [
                    {
                        text: 'Sim',
                        style: 'default',
                        onPress: () => downloadFile()
                    },
                    {
                        text: 'Não',
                        style: 'cancel'
                    }
                ]
            )
        }
    }

    const downloadFile = async () => {
        if (documentId && (fileName && fileName !== '')) {
            const response = await userGetDocumentFile(documentId)
            if (response.status === 200) {
                const ret = await saveFileToDevice(response.data.data, fileName)
                if (ret.recorded)
                    Alert.alert(
                        'Download',
                        'Download concluído com sucesso. Verifique sua pasta de Downloads',
                        [
                            {
                                text: 'OK',
                                style: 'default'
                            }
                        ]
                    )
                else
                    Toast.show({
                        type: 'warning',
                        text2: 'Erro inesperado no download do arquivo',
                    })
            } else {
                Toast.show({
                    type: 'danger',
                    text2: 'Ocorreu um erro ao baixar o arquivo',
                })
            }

        }
    }

    const removeFile = async () => {
        Alert.alert(
            'Confirma a remoção do anexo?',
            '',
            [
                {
                    text: 'Sim',
                    style: 'default',
                    onPress: () => {
                        setFile(undefined)
                        setFileName('')
                        setDocId(undefined)
                    }
                },
                {
                    text: 'Não',
                    style: 'cancel'
                }
            ]
        )
    }

    return (
        <>
            <View style={styles.container}>
                {docId ? (
                    <>
                        <TouchableOpacity
                            disabled={disabled}
                            style={styles.buttonDownload}
                            onPress={download}>
                            <View style={styles.containerButton}>
                                <Icon name='cloud-download-outline' style={styles.iconControl} size={20} pack='ionicons' />
                                <Text style={[styles.text, styles.textControl]} category='s1'>Baixar</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={disabled}
                            style={styles.buttonRemove}
                            onPress={removeFile}>
                            <View style={styles.containerButton}>
                                <Icon name='trash-outline' style={styles.iconControl} size={20} pack='ionicons' />
                                <Text style={[styles.text, styles.textControl]} category='s1'>Remover</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                ) : (
                    (isNew && fileName === '') || (!isNew && !docId && fileName === '') ?
                        <>
                            <TouchableOpacity
                                onPress={openLibrary}
                                style={styles.button}>
                                <View style={styles.containerButton}>
                                    <Icon name='images-outline' style={styles.icon} size={25} pack='ionicons' />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={openCamera}
                                style={styles.button}>
                                <View style={styles.containerButton}>
                                    <Icon name='camera-outline' style={styles.icon} size={25} pack='ionicons' />
                                </View>
                            </TouchableOpacity>
                            {Platform.OS === 'ios' && (
                                <TouchableOpacity
                                    onPress={openFolder}
                                    style={styles.button}>
                                    <View style={styles.containerButton}>
                                        <Icon name='folder-open-outline' style={styles.icon} size={25} pack='ionicons' />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </>
                        :
                        <>
                            <TouchableOpacity
                                disabled={disabled}
                                style={styles.buttonRemove}
                                onPress={removeFile}>
                                <View style={styles.containerButton}>
                                    <Icon name='trash-outline' style={styles.iconControl} size={20} pack='ionicons' />
                                    <Text style={[styles.text, styles.textControl]} category='s1'>Remover</Text>
                                </View>
                            </TouchableOpacity>
                        </>


                )}
            </View>
        </>
    )
}

export default AttachmentBoxComponent