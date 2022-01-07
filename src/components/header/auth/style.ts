import { Platform, StatusBar, StyleSheet } from 'react-native'

export const headerStyle = StyleSheet.create({
  layout: {
    paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
  },
  topNavigation: {
    backgroundColor: 'background-basic-color-1'
  },
  icon: {
    color: '#222B45'
  }
})
