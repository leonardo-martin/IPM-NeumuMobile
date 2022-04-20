import { Platform, StatusBar, StyleSheet } from 'react-native'

export const headerStyle = StyleSheet.create({
  layout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topNavigation: {
    backgroundColor: 'background-basic-color-1'
  },
  label: {
    fontFamily: "System",
    fontWeight: Platform.OS === 'ios' ? "600" : "800",
    marginBottom: 4,
    textTransform: 'uppercase',
    fontSize: 14
  },
  containerAction: {
    paddingHorizontal: 15,
    alignItems: 'center'
  }
})
