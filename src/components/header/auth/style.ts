import { Platform, StatusBar, StyleSheet } from 'react-native'
import { AppInfoService } from '@services/app-info.service'

const model = AppInfoService.getModel()

export const headerStyle = StyleSheet.create({
  layout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight :
      Platform.OS === 'ios' && (Number(model.split(' ')[1] ? model.split(' ')[1].toString() : 0) >= 11 || model.includes('iPhone X')) ? 30 : 10,
  },
  topNavigation: {
    backgroundColor: 'background-basic-color-1'
  },
  icon: {
    color: '#222B45'
  }
})
