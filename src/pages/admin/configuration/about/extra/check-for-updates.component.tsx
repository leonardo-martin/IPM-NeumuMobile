import UpdateAppDialog from '@components/dialog/updateApp'
import { useModal } from '@hooks/useModal'
import { Modal, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import codePush, { DownloadProgress, RemotePackage } from "react-native-code-push"
import Toast from 'react-native-toast-message'
import { checkForUpdateStyle } from './check-for-updates.style'

const MIN_TIME = 5

const CheckForUpdatesComponent: FC = (): ReactElement => {

    const { ref } = useModal<Modal>()
    const styles = useStyleSheet(checkForUpdateStyle)
    const [message, setMessage] = useState<string>('')
    const [isCheckingForUpdate, setIsCheckingForUpdate] = useState<boolean>()
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>()
    const [remotePackage, setRemotePackage] = useState<RemotePackage>()

    const getProgress = (progress: DownloadProgress) => {
        setMessage('Baixando...')
        setDownloadProgress(progress)
    }

    const getRemotePackage = (update: RemotePackage) => setRemotePackage(update)

    const codePushStatusDidChange = (syncStatus: codePush.SyncStatus) => {
        switch (syncStatus) {
            case codePush.SyncStatus.UP_TO_DATE:
                if (message === '')
                    setIsCheckingForUpdate(false)
                Alert.alert(
                    'Atualização',
                    'Você está com a versão mais recente.',
                    [
                        {
                            text: 'OK',
                            style: 'default'
                        }
                    ]
                )
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                setMessage('Atualizado com sucesso!')
                var timeleft = MIN_TIME
                var downloadTimer = setInterval(function () {
                    setMessage(`Reiniciando em ${timeleft} segundos`)
                    if (timeleft <= 0) {
                        clearInterval(downloadTimer)
                        codePush.restartApp(true)
                    }
                    timeleft -= 1
                }, 1000)
                break;
            case codePush.SyncStatus.UPDATE_IGNORED:
                setIsCheckingForUpdate(false)
                Alert.alert(
                    'Aviso',
                    'Atualização ignorada. Caso não seja realizado a atualização, pode haver problemas durante o uso do aplicativo.',
                    [
                        {
                            text: 'OK, Estou ciente',
                            style: 'default'
                        },
                    ]
                )
                break;
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                setIsCheckingForUpdate(true)
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                setMessage('Sincronizando...')
                setVisibleModal(true)
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                setMessage('Instalando...')
                break;

        }
    }

    const checkForUpdates = async () => {
        try {
            await codePush.sync({
                installMode: codePush.InstallMode.ON_NEXT_RESTART,
                mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
                updateDialog: {
                    appendReleaseDescription: true,
                    title: "Atualização",
                    mandatoryUpdateMessage: "Atualização obrigatória. Clique em 'INSTALAR AGORA' para atualizar",
                    mandatoryContinueButtonLabel: "Instalar Agora",
                    optionalUpdateMessage: "Uma nova versão está disponível. Clique em 'INSTALAR AGORA' para atualizar.",
                    optionalIgnoreButtonLabel: 'Cancelar',
                    optionalInstallButtonLabel: 'Instalar Agora'
                },
            },
                codePushStatusDidChange,
                getProgress,
                getRemotePackage
            )
        } catch (error) {
            setIsCheckingForUpdate(false)
            if (error && (error as any).toString().includes('valid deployment key'))
                Toast.show({
                    type: 'danger',
                    text2: 'Chave incorreta. Entre em contato com o administrador',
                })
            else
                Toast.show({
                    type: 'danger',
                    text2: 'Erro desconhecido. Entre em contato com o administrador',
                })
        }
    }

    const LoadingIndicator = () => (
        <Spinner size='tiny' status='basic' />
    )

    return (
        <>
            <TouchableOpacity disabled={isCheckingForUpdate} style={styles.checkForUpdatesBtn} onPress={checkForUpdates}>
                <Text style={styles.checkForUpdatesText}>Procurar por atualizações</Text>
                {isCheckingForUpdate && LoadingIndicator()}
            </TouchableOpacity>

            <UpdateAppDialog
                ref={ref}
                visible={visibleModal}
                message={message}
                progress={downloadProgress}
                package={remotePackage}
            />
        </>
    )
}

export default CheckForUpdatesComponent
