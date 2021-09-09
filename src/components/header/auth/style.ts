import { StyleSheet, Platform } from 'react-native'

export const headerStyle = StyleSheet.create({
  layout: {
    paddingTop: Platform.OS === 'ios' ? 30 : 0
  },
  container: {
    backgroundColor: '#FAFAFA'
  }
})
