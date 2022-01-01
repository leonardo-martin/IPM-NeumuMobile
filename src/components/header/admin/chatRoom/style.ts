import { StatusBar, StyleSheet } from 'react-native'

export const headerStyle = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  layout: {
    paddingTop: StatusBar.currentHeight,
  },
  icon: {
    color: 'color-basic-600'
  },
  viewActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  titleSecondary: {
    color: 'text-hint-color'
  },
})


