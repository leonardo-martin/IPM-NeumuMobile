import { useTheme } from '@ui-kitten/components'
import React from 'react'
import { BaseToast, BaseToastProps, ErrorToast } from "react-native-toast-message"

export const toastConfig = {
  success: (props: BaseToastProps) => {
    const theme = useTheme()
    return (
      <BaseToast
        {...props}
        style={{ borderLeftColor: theme['border-success-color-1'] }}
        text1='Sucesso!'
      />
    )
  },
  info: (props: BaseToastProps) => {
    const theme = useTheme()
    return (
      <BaseToast
        {...props}
        style={{ borderLeftColor: theme['border-primary-color-1'] }}
        text1='Informação'
      />
    )
  },
  warning: (props: BaseToastProps) => {
    const theme = useTheme()
    return (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: theme['border-warning-color-1'] }}
        text1='Atenção'
      />
    )
  },
  danger: (props: BaseToastProps) => {
    const theme = useTheme()
    return (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: theme['border-danger-color-1'] }}
        text1='Erro'
      />
    )
  }
}