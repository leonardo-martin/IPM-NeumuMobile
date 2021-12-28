import { FC } from 'react'
import { Platform, ToastAndroid } from 'react-native'

interface ToastProps {
    visible: boolean
    message: string
    duration?: ToastAndroid["LONG"] | ToastAndroid["SHORT"]
    gravity?: ToastAndroid["BOTTOM"] | ToastAndroid["TOP"] | ToastAndroid["CENTER"]
    xOffset?: number
    yOffset?: number
}

const Toast: FC<ToastProps> = ({ visible, message, duration, gravity, xOffset, yOffset }) => {

    if (visible && Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset(
            message,
            Number(duration),
            Number(gravity),
            Number(xOffset),
            Number(yOffset)
        )
        return null
    }
    return null
}

Toast.defaultProps = {
    visible: false,
    message: 'Message Example',
    duration: ToastAndroid["LONG"],
    gravity: ToastAndroid["BOTTOM"],
    xOffset: 25,
    yOffset: 50
}

export default Toast