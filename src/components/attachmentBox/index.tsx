import { getFileFromDevice } from '@services/document.service'
import { Icon, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { DocumentDto } from 'models/Document'
import React, { Dispatch, FC, ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { DocumentPickerOptions, DocumentPickerResponse } from 'react-native-document-picker'
import { SupportedPlatforms } from 'react-native-document-picker/lib/typescript/fileTypes'
import Toast from 'react-native-toast-message'
import { attachBoxStyle } from './style'

interface AttachmentBoxProps {
    file: DocumentPickerResponse[] | undefined
    handleFile: Dispatch<React.SetStateAction<DocumentPickerResponse[] | undefined>>
    label?: string
    documentPickerOptions?: DocumentPickerOptions<SupportedPlatforms> | undefined
    documentDto?: DocumentDto
    handleDocumentDto?: () => void
    loading?: boolean

}

const AttachmentBoxComponent: FC<AttachmentBoxProps> = ({ ...props }): ReactElement => {

    const styles = useStyleSheet(attachBoxStyle)

    const handleDocumentSelection = async () => {
        try {
            const response = await getFileFromDevice(props.documentPickerOptions)
            props.handleFile(response)
        } catch (err: any) {
            if (!err.toString().includes('cancelled.'))
                Toast.show({
                    type: 'info',
                    text2: 'Operação cancelada',
                })
        }
    }

    return (
        <>
            <Text style={styles.label}>{props.label}</Text>
            <TouchableOpacity
                style={styles.attachDoc}
                onPress={handleDocumentSelection}>
                {!props.file && !props.documentDto ? (
                    !props.loading ? (
                        <>
                            <Text style={styles.text} category='label' appearance='hint'>ARQUIVO</Text>
                            <Icon name='attach-outline' style={styles.icon} size={20} pack='ionicons' />
                        </>
                    ) : (
                        <Spinner size='giant' status='primary' />
                    )
                )
                    :
                    props.documentDto ? (
                        <View style={styles.containerFile}>
                            <Text style={styles.textFile} category='s1'>{props.documentDto.documentFormat}</Text>
                            <TouchableOpacity onPress={props.handleDocumentDto}>
                                <Icon name='close-outline' style={styles.iconRed} size={30} pack='ionicons' />
                            </TouchableOpacity>
                        </View>
                    ) : props.file && (
                        <View style={styles.containerFile}>
                            <Text style={styles.textFile} category='s1'>{props.file[0].name}</Text>
                            <TouchableOpacity onPress={() => props.handleFile(undefined)}>
                                <Icon name='close-outline' style={styles.iconRed} size={30} pack='ionicons' />
                            </TouchableOpacity>
                        </View>
                    )
                }
            </TouchableOpacity>
        </>
    )
}

AttachmentBoxComponent.defaultProps = {
    label: 'Anexar Documento'
}

export default AttachmentBoxComponent