import RequestUnderageDialog from '@components/dialog/requestUnderageDialog'
import { useModal } from '@hooks/useModal'
import { useFocusEffect } from '@react-navigation/native'
import { AppStorage } from '@services/app-storage.service'
import { updateUnderagePermission } from '@services/underage.service'
import { Modal, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { pendingApprovalMappingProgramStyle } from './pending-approval.style'

const PendingApprovalMappingProgram: FC = (): ReactElement => {

    const styles = useStyleSheet(pendingApprovalMappingProgramStyle)
    const [responsibleEmail, setResponsibleEmail] = useState<string>()
    const { ref: requestUnderageRef } = useModal<Modal>()
    const [visibleModal, setVisibleModal] = useState<boolean>(false)

    const load = async () => {
        const email = await AppStorage.getItem('UNDERAGE_EMAIL')
        setResponsibleEmail(email ?? undefined)
    }

    useFocusEffect(
        useCallback(() => {
            load()
        }, [])
    )

    const changeEmail = async (responsibleEmail: string) => {
        try {
            const response = await updateUnderagePermission({
                email: responsibleEmail
            })
            if (response.status === 200) {
                await AppStorage.setItem('UNDERAGE_EMAIL', responsibleEmail)
                setResponsibleEmail(responsibleEmail)
                Toast.show({
                    type: 'success',
                    text2: 'E-mail alterado com sucesso',
                })
            } else {
                Toast.show({
                    type: 'danger',
                    text2: 'Erro alterar o e-mail',
                })
            }
        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Ocorreu um erro inesperado',
            })
        }
    }

    const callback = (success: boolean, data?: { responsibleEmail: string }) => {
        if (success && data?.responsibleEmail) {
            changeEmail(data.responsibleEmail)
        }
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.view}>
                    <Text category='label' style={styles.text}>Solicitação enviada ao responsável.</Text>
                </View>
                <View style={styles.view}>
                    <Text style={styles.text}>Para finalizar o cadastro no <Text
                        status='primary' style={[styles.text, styles.bold]}>Programa de Mapeamento Genético</Text>, acesse a caixa de e-mail abaixo, procure pelo e-mail e clique em &ldquo;
                        <Text status='success' style={[styles.text, styles.bold]}>APROVAR</Text>&rdquo;.</Text>
                </View>
                {responsibleEmail && responsibleEmail !== '' && (
                    <><View style={styles.view}>
                        <Text style={[styles.text, styles.contact, { paddingEnd: 5 }]}>E-mail:</Text>
                        <Text style={[styles.text, styles.contact]}>{responsibleEmail}</Text>
                    </View>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => setVisibleModal(true)}
                        >
                            <Text category='label' style={styles.textEdit}>Editar e-mail</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
            <RequestUnderageDialog
                ref={requestUnderageRef}
                onVisible={setVisibleModal}
                visible={visibleModal}
                callback={callback}
            />
        </>
    )
}

export default PendingApprovalMappingProgram