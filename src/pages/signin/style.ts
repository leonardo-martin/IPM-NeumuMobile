import { Platform, StyleSheet } from 'react-native'

export const loginStyle = StyleSheet.create({
  content: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    alignContent: 'center',
    backgroundColor: '#FAFAFA'
  },
  boxTitle: {
    paddingVertical: 60,
    alignItems: 'center'
  },
  title: {
    color: '#626262',
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
    backgroundColor: '#FEFEFE',
    borderRadius: 10,
    borderColor: '#EBEBEB',
    shadowRadius: 4,
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.03)',
  },
  text: {
    color: '#626262',
    fontWeight: Platform.OS === 'ios' ? '400' : '600'
  },
  textHere: {
    fontWeight: Platform.OS === 'ios' ? '400' : '600'
  },
  containerLogo: {
    alignItems: "center",
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    borderRadius: 30
  },
  textModal: {
    fontWeight: Platform.OS === 'ios' ? 'bold' : '600'
  }
})
