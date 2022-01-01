import { StatusBar, StyleSheet } from 'react-native'

export const headerStyle = StyleSheet.create({
  layout: {
    paddingTop: StatusBar.currentHeight,
  },
  icon: {
    color: 'color-basic-600'
  }
})
