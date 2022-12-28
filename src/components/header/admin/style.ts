import { Platform, StatusBar, StyleSheet } from 'react-native'
import { AppInfoService } from '@services/app-info.service'

const model = AppInfoService.getModel()

export const headerStyle = StyleSheet.create({
  layout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight :
      (Platform.OS === 'ios' || (Number(model.split(' ')[1] ? model.split(' ')[1].toString() : 0) >= 11 || model.includes('iPhone X'))) ? 30 : 10,
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