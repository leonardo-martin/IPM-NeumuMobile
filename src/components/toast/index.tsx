import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { DeviceEventEmitter, TouchableOpacity, Platform, ToastAndroid } from 'react-native'
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { Text, useTheme, useStyleSheet } from '@ui-kitten/components'
import { SHOW_TOAST_MESSAGE } from '@constants/toast'

import { toastStyle } from './style'

type Colors = 'primary' | 'info' | 'success' | 'danger' | 'warning' | 'control'

const useColors = () => {

    const theme = useTheme()
    return {
        primary: theme['color-info-default'],
        info: theme['color-primary-default'],
        success: theme['color-success-default'],
        danger: theme['color-danger-default'],
        warning: theme['color-warning-default'],
        control: theme['color-control-default']
    }

}

const Toast: FC = (): ReactElement => {

    const colors = useColors()
    const styles = useStyleSheet(toastStyle)
    const [messageType, setMessageType] = useState<Colors>('control')
    const timeOutRef: { current: number | null } = useRef(null)
    const animatedOpacity = useSharedValue(0)
    const [timeOutDuration, setTimeOutDuration] = useState(5000)
    const [message, setMessage] = useState(null)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: animatedOpacity.value,
        }
    }, [])

    const onNewToast = (data: any) => {
        if (Platform.OS === 'android' && data.useNativeToast) {
            return ToastAndroid.show(data.message, ToastAndroid.LONG)
        }
        if (data.duration) {
            setTimeOutDuration(data.duration)
        }
        setMessage(data.message)
        setMessageType(data.type)
    }

    const closeToast = useCallback(() => {
        setMessage(null)
        setTimeOutDuration(5000)
        animatedOpacity.value = withTiming(0)
        clearInterval(timeOutRef.current || 0)
    }, [animatedOpacity])

    useEffect(() => {
        if (message) {
            timeOutRef.current = setInterval(() => {
                if (timeOutDuration === 0) {
                    closeToast()
                } else {
                    setTimeOutDuration(prev => prev - 1000)
                }
            }, 1000)
        }
        return () => {
            clearInterval(timeOutRef.current || 0)
        }
    }, [closeToast, message, timeOutDuration])

    useEffect(() => {
        if (message) {
            animatedOpacity.value = withTiming(1, { duration: 1000 })
        }
    }, [message, animatedOpacity])

    useEffect(() => {
        DeviceEventEmitter.addListener(SHOW_TOAST_MESSAGE, onNewToast)

        return () => {
            DeviceEventEmitter.removeAllListeners()
        }
    }, [])

    if (!message) {
        return <></>
    }

    return (
        <Animated.View
            style={[{
                ...styles.container,
                backgroundColor: colors[messageType]
            },
                animatedStyle,
            ]}>
            <TouchableOpacity onPress={closeToast}>
                <Text
                    style={styles.text}>
                    {message}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default Toast