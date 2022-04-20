import { Platform, StatusBar, StyleSheet } from 'react-native'

export const headerStyle = StyleSheet.create({
  layout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topNavigation: {
    backgroundColor: 'background-basic-color-1'
  },
  icon: {
    color: '#222B45'
  }
})
