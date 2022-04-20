import { Platform, StatusBar, StyleSheet } from 'react-native'
import { AppInfoService } from '@services/app-info.service'

const model = AppInfoService.getModel()

export const headerStyle = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  layout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight :
      Platform.OS === 'ios' && (Number(model.split(' ')[1] ? model.split(' ')[1].toString() : 0) >= 11 || model.includes('iPhone X')) ? 30 : 10,
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


