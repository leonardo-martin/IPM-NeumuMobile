import { Platform, StatusBar, StyleSheet } from 'react-native'

export const headerStyle = StyleSheet.create({
  layout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  }
})
