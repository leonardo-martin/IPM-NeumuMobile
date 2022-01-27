import { DeviceEventEmitter } from 'react-native'
import { SHOW_TOAST_MESSAGE } from '@constants/toast'

const toast = {
    primary: (options: Object) => {
        DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, { ...options, type: 'primary' })
    },
    info: (options: Object) => {
        DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, { ...options, type: 'info' })
    },
    success: (options: Object) => {
        DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, { ...options, type: 'success' })
    },
    danger: (options: Object) => {
        DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, { ...options, type: 'danger' })
    },
    warning: (options: Object) => {
        DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, { ...options, type: 'warning' })
    },
    control: (options: Object) => {
        DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, { ...options, type: 'control' })
    },
}

export default toast