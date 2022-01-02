import { Platform, StatusBar, StyleSheet } from 'react-native'

export const headerStyle = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  layout: {
    paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight,
  },
  viewActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  titleSecondary: {
    color: 'text-hint-color'
  },
})


