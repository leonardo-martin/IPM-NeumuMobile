import { Platform, StatusBar, StyleSheet } from 'react-native'

export const headerStyle = StyleSheet.create({
  layout: {
    paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
    backgroundColor: '#FAFAFA'
  },
  container: {
    backgroundColor: '#FAFAFA'
  },
  icon: {
    color: '#222B45'
  }
})
