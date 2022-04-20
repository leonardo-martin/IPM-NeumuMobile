import React, { Dispatch, FC, ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Text, useStyleSheet } from '@ui-kitten/components'
import { DocumentPickerResponse } from 'react-native-document-picker'

import toast from '@helpers/toast'
import { getFileFromDevice } from '@services/document.service'
import { attachBoxStyle } from './style'

interface AttachmentBoxProps {
    file: DocumentPickerResponse[] | undefined
    handleFile: Dispatch<React.SetStateAction<DocumentPickerResponse[] | undefined>>
    label?: string
}

const AttachmentBoxComponent: FC<AttachmentBoxProps> = ({ ...props }): ReactElement => {

    const styles = useStyleSheet(attachBoxStyle)

    const handleDocumentSelection = async () => {
        try {
            const response = await getFileFromDevice()
            props.handleFile(response)
        } catch (err: any) {
            if (!err.toString().includes('cancelled.'))
                toast.danger({ message: 'Operação cancelada.', duration: 3000 })
        }
    }

    return (
        <>
            <Text style={styles.label}>{props.label}</Text>
            <TouchableOpacity
                style={styles.attachDoc}
                onPress={handleDocumentSelection}>
                {!props.file ?
                    <>
                        <Text style={styles.text} category='label' appearance='hint'>ARQUIVO</Text>
                        <Icon name='attach-outline' style={styles.icon} size={20} pack='ionicons' />
                    </>
                    :
                    <View style={styles.containerFile}>
                        <Text style={styles.textFile} category='s1'>{props.file[0].name}</Text>
                        <TouchableOpacity onPress={() => props.handleFile(undefined)}>
                            <Icon name='close-outline' style={styles.iconRed} size={30} pack='ionicons' />
                        </TouchableOpacity>
                    </View>
                }
            </TouchableOpacity>
        </>
    )
}

AttachmentBoxComponent.defaultProps = {
    label: 'Anexar Documento'
}

export default AttachmentBoxComponent