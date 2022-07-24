import { Icon, useTheme } from '@ui-kitten/components'
import React from 'react'
import { View } from 'react-native'
import Toast, { BaseToast, BaseToastProps, ErrorToast, ToastConfig } from 'react-native-toast-message'
import { toastStyle } from './style'

const _TEXT1_NUMBER_OF_LINES = 2
const _TEXT2_NUMBER_OF_LINES = 3

const renderTrailingIcon = () => {
  const theme = useTheme()
  return (
    <View style={toastStyle.trailingContainer}>
      <Icon name='close-outline' style={{
        color: theme['color-basic-700']
      }} size={20} onPress={() => Toast.hide()} />
    </View>
  )
}

export const toastConfig: ToastConfig | undefined = {
  success: (props: BaseToastProps) => {
    const theme = useTheme()
    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme['border-success-color-1'],
          ...toastStyle.toast
        }}
        text1='Sucesso!'
        text1Style={toastStyle.text1Style}
        text2Style={toastStyle.text2Style}
        text1NumberOfLines={_TEXT1_NUMBER_OF_LINES}
        text2NumberOfLines={_TEXT2_NUMBER_OF_LINES}
        renderTrailingIcon={renderTrailingIcon}
      />
    )
  },
  info: (props: BaseToastProps) => {
    const theme = useTheme()
    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme['border-primary-color-1'],
          ...toastStyle.toast
        }}
        text1='Informativo'
        text1Style={toastStyle.text1Style}
        text2Style={toastStyle.text2Style}
        text1NumberOfLines={_TEXT1_NUMBER_OF_LINES}
        text2NumberOfLines={_TEXT2_NUMBER_OF_LINES}
        renderTrailingIcon={renderTrailingIcon}
      />
    )
  },
  warning: (props: BaseToastProps) => {
    const theme = useTheme()
    return (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme['border-warning-color-1'],
          ...toastStyle.toast
        }}
        text1='Importante'
        text1Style={toastStyle.text1Style}
        text2Style={toastStyle.text2Style}
        text1NumberOfLines={_TEXT1_NUMBER_OF_LINES}
        text2NumberOfLines={_TEXT2_NUMBER_OF_LINES}
        renderTrailingIcon={renderTrailingIcon}
      />
    )
  },
  danger: (props: BaseToastProps) => {
    const theme = useTheme()
    return (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme['border-danger-color-1'],
          ...toastStyle.toast
        }}
        text1='Algo deu errado...'
        text1Style={toastStyle.text1Style}
        text2Style={toastStyle.text2Style}
        text1NumberOfLines={_TEXT1_NUMBER_OF_LINES}
        text2NumberOfLines={_TEXT2_NUMBER_OF_LINES}
        renderTrailingIcon={renderTrailingIcon}
      />
    )
  }
}