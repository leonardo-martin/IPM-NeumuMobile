import { Platform, StyleSheet } from 'react-native'

export const loginStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  boxTitle: {
    paddingVertical: 30,
    alignItems: 'center'
  },
  title: {
    color: 'text-hint-color',
    fontSize: 22,
    lineHeight: 26,
    paddingTop: 10,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  box: {
    width: '85%'
  },
  containerRecoveryPassword: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  textRecoveryPassword: {
    fontWeight: Platform.OS === 'ios' ? '400' : '600',
    color: 'text-hint-color',
    fontSize: 14,
  },
  containerButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  button: {
    borderRadius: 50,
    marginVertical: 5
  },
  input: {
    paddingVertical: 5
  },
  text: {
    color: 'text-basic-color',
    alignItems: 'flex-start',
    fontSize: 11,
  },
  textHere: {
    fontWeight: Platform.OS === 'ios' ? '400' : '600'
  },
  containerLogo: {
    alignItems: "center",
  },
  checkboxText: {
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    color: 'text-hint-color'
  },
  containerCheckbox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
