import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { Card, Modal, Text, useStyleSheet } from '@ui-kitten/components'
import { formatBytes } from '@utils/common'
import React, { FC, ForwardedRef, forwardRef, ReactElement } from 'react'
import { View } from 'react-native'
import { DownloadProgress, RemotePackage } from 'react-native-code-push'
import { modalUpdateAppStyle } from './style'

interface UpdateAppDialogProps {
    ref: ForwardedRef<Modal>
    visible: boolean
    message?: string
    progress?: DownloadProgress | null
    package?: RemotePackage
}

const UpdateAppDialog: FC<UpdateAppDialogProps> = forwardRef<Modal, React.PropsWithChildren<UpdateAppDialogProps>>(({ ...props }, ref): ReactElement => {

    const combinedRef = useCombinedRefs(ref, ref)
    const styles = useStyleSheet(modalUpdateAppStyle)

    return (
        <Modal
            ref={combinedRef}
            style={styles.modal}
            visible={props.visible}
            backdropStyle={styles.backdrop}>
            <Card disabled style={styles.card}>
                <View style={styles.container}>
                    <View style={styles.spacing}>
                        <Text style={styles.text}>{props.message ?? ''}</Text>
                    </View>
                    {props.progress && (
                        <>
                            <View style={styles.spacing}>
                                <Text style={styles.textProgress}>Recebido: {formatBytes(props.progress?.receivedBytes ?? 0)}</Text>
                            </View>
                            <Text style={styles.textProgress}>Total: {formatBytes(props.progress?.totalBytes ?? 0)}</Text>
                        </>
                    )}
                </View>

            </Card>
        </Modal>
    )
})

export default UpdateAppDialog