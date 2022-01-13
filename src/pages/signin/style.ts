import { Platform, StyleSheet } from 'react-native'

export const loginStyle = StyleSheet.create({
  content: {
    flex: 1,
  },
  viewContent: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  boxTitle: {
    paddingBottom: 30,
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
    paddingTop: '3%',
    padding: '2%',
    paddingBottom: '5%',
    flexDirection: 'row',
    alignItems: 'center'
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
    color: 'text-hint-color',
    fontWeight: Platform.OS === 'ios' ? '400' : '600'
  },
  textHere: {
    fontWeight: Platform.OS === 'ios' ? '400' : '600'
  },
  containerLogo: {
    alignItems: "center",
  }
})
