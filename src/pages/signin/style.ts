import { StyleSheet } from 'react-native'

export const loginStyle = StyleSheet.create({
  content: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-evenly',
    alignContent: 'center',
    backgroundColor: '#FAFAFA'
  },
  boxTitle: {
    alignItems: 'center'
  },
  title: {
    color: '#626262',
    fontSize: 22,
    lineHeight: 26,
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
    flexDirection: 'row'
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
    backgroundColor: '#FEFEFE',
    borderRadius: 10,
    borderColor: '#EBEBEB',
    shadowRadius: 4,
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.03)'
  },
  text: {
    color: '#626262'
  },
  textHere: {
    textDecorationLine: 'underline'
  }
})
