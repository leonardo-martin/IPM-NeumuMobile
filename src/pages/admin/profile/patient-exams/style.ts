import { I18nManager, StyleSheet } from 'react-native'

export const myExamsStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center'
  },
  viewTop: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerItem: {
    height: 60,
    backgroundColor: 'text-control-color',
    justifyContent: 'center',
    marginTop: 4,
  },
  text: {
    color: 'text-hint-color',
    fontWeight: 'bold',
  },
  textWhite: {
    color: 'text-control-color',
    fontSize: 12,
    fontWeight: '700'
  },
  icon: {
    color: 'color-basic-300',
  },
  iconFilter: {
    color: 'text-basic-color',
  },
  viewDate: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  textDate: {
    textAlign: 'right',
    minWidth: 64
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginVertical: 4,
  },
  viewActions: {
    width: 160,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
  }
})