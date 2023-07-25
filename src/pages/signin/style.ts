import { Dimensions, Platform, StyleSheet } from 'react-native'

const { width } = Dimensions.get('screen')

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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  textRecoveryPassword: {
    fontWeight: Platform.OS === 'ios' ? '400' : '600',
    color: 'text-hint-color',
    fontSize: 12,
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
    fontWeight: Platform.OS === 'ios' ? '400' : '600',
    color: 'text-hint-color'
  },
  containerCheckbox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  containerContact: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  containerVersion: {
    alignItems: 'center'
  },
  contactText: {
    color: 'text-hint-color',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  icon: {
    color: 'text-hint-color',
  },
})
