import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { NotificationService } from '@services/notification.service'
import { Divider, List, ListItem, Toggle, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { ListRenderItemInfo } from 'react-native'
import { DeviceState } from 'react-native-onesignal'
import Toast from 'react-native-toast-message'
import { AppInfoService } from 'services/app-info.service'
import { LogService } from 'services/log.service'
import { notificationStyle } from './style'

interface ItemData {
    title: string
    checked: boolean
}

const NotificationScreen: FC = (): ReactElement => {

    const logService = new LogService()
    const styles = useStyleSheet(notificationStyle)
    const [isStarting, setIsStarting] = useState<boolean>(true)
    const [deviceState, setDeviceState] = useState<DeviceState | null>(null)
    const [data, setData] = useState<ItemData[]>([{ title: 'Receber Notificações', checked: false }])

    const loadDeviceState = async () => {
        const device = await NotificationService.getDeviceState()
        if (device) {
            if (device.hasNotificationPermission && !device.isPushDisabled) {
                enableNotification(true)
            } else {
                enableNotification(false)
            }
        } else {
            enableNotification(false)
        }
        setIsStarting(false)
        setDeviceState(device)
    }

    const isFocused = useIsFocused()

    useEffect(() => {
        if (!isFocused) {
            setDeviceState(null)
            setIsStarting(true)
        }

    }, [isFocused])


    useFocusEffect(
        useCallback(() => {
            if (deviceState === null && isStarting) {
                loadDeviceState()
            }
        }, [deviceState, isStarting])
    )

    const enableNotification = async (checked: boolean) => {
        if (!(await AppInfoService.isEmulator())) {
            setData([{
                title: 'Receber Notificações',
                checked: checked
            }])
            try {
                if (checked) {
                    NotificationService.enablePushNotification()
                    NotificationService.disablePushNotification(false)
                } else if (!checked) {
                    NotificationService.disablePushNotification(true)
                }
                setDeviceState(await NotificationService.getDeviceState())
            } catch (error) {
                Toast.show({
                    type: 'danger',
                    text2: 'Erro inesperado',
                })
            }
        } else {
            Toast.show({
                type: 'warning',
                text2: 'Simulador não está habilitado para receber notificações',
            })
        }
    }

    const renderToggle = (props: any) => (
        <Toggle
            checked={props.item.checked}
            onChange={(checked) => enableNotification(checked)}
        />
    )

    const renderItem = (info: ListRenderItemInfo<ItemData>) => (
        <>
            <ListItem
                style={styles.item}
                title={info.item.title}
                accessoryRight={() => renderToggle(info)}
            />
            <Divider />
        </>
    )

    return (
        <>
            {data.length > 0 && (
                <List
                    data={data}
                    renderItem={renderItem}
                />
            )}
        </>
    )
}

export default NotificationScreen