import { FileDto } from '@models/Document'
import { getFileFromDevice, launchCameraFromDevice, launchImageLibraryFromDevice } from '@services/document.service'
import { Icon, Text, useStyleSheet } from '@ui-kitten/components'
import { generateHash } from '@utils/common'
import React, { FC, ReactElement } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { attachBoxStyle } from './style'

interface AttachmentBoxProps {
    setFile: React.Dispatch<React.SetStateAction<FileDto[] | undefined>>
    setFileName: React.Dispatch<React.SetStateAction<string | undefined>>
    fileName?: string
}

const AttachmentBoxComponent: FC<AttachmentBoxProps> = ({ ...props }): ReactElement => {

    const styles = useStyleSheet(attachBoxStyle)

    const openFolder = async () => {
        try {
            const response = await getFileFromDevice()
            if (response) {
                props.setFile([{
                    uri: response[0].uri,
                    type: response[0].type,
                    fileName: response[0].name,
                    size: response[0].size
                }])
                props.setFileName(`D_${generateHash(16)}.${response[0].name?.split('.')[1] || ''}`)
            }

        } catch (err: any) {
            console.error(err)
        }
    }

    const openLibrary = async () => {
        try {
            const response = await launchImageLibraryFromDevice()
            if (response.assets) {
                props.setFile([{
                    uri: response.assets[0].uri || '',
                    type: response.assets[0].type || '',
                    fileName: response.assets[0].fileName || '',
                    size: response.assets[0].fileSize || null
                }])
                props.setFileName(`IMG_${generateHash(16)}.${response.assets[0].fileName?.split('.')[1] || ''}`)
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
                props.setFile([{
                    uri: response.assets[0].uri || '',
                    type: response.assets[0].type || '',
                    fileName: response.assets[0].fileName || '',
                    size: response.assets[0].fileSize || null
                }])
                props.setFileName(`DCIM_${generateHash(16)}.${response.assets[0].fileName?.split('.')[1] || ''}`)
            }
        } catch (err: any) {
            console.error(err)
            Toast.show({
                type: 'danger',
                text2: 'Ocorreu um erro ao abrir a câmera',
            })
        }
    }

    return (
        <>
            <View style={styles.container}>
                {props.fileName ? (
                    <>
                        <Text style={styles.textFile} category='s1'>{props.fileName}</Text>
                        <TouchableOpacity onPress={() => {
                             props.setFile(undefined)
                             props.setFileName('')
                        }}>
                            <Icon name='trash-outline' style={styles.iconPrimary} size={20} pack='ionicons' />
                        </TouchableOpacity>
                    </>
                ) : (
                    <><TouchableOpacity
                        onPress={openLibrary}
                        style={styles.attachDoc}>
                        <Icon name='images-outline' style={styles.icon} size={25} pack='ionicons' />
                    </TouchableOpacity>
                        <TouchableOpacity
                            onPress={openCamera}
                            style={styles.attachDoc}>
                            <Icon name='camera-outline' style={styles.icon} size={25} pack='ionicons' />
                        </TouchableOpacity>
                        {Platform.OS === 'ios' && (
                            <TouchableOpacity
                                onPress={openFolder}
                                style={styles.attachDoc}>
                                <Icon name='folder-open-outline' style={styles.icon} size={25} pack='ionicons' />
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </>
    )
}

export default AttachmentBoxComponent