import { Platform, StyleSheet } from 'react-native'

export const profileStyle = StyleSheet.create({
  content: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  avatar: {
    width: 130,
    height: 130,
    borderWidth: 4,
    borderColor: '#626262',
    marginBottom: 10,
    alignSelf: 'center'
  },
  profileName: {
    fontSize: 22,
    fontWeight: Platform.OS === 'ios' ? '400' : '600'
  },
  body: {
    paddingTop: 10
  },
  bodyContent: {
    alignItems: 'center',
    padding: 0
  },
  info: {
    fontSize: 16,
    marginTop: 10
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center'
  },
  footer: {
    backgroundColor: '#FAFAFA',
    alignItems: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 30
  },
  textFooter: {
    fontWeight: Platform.OS === 'ios' ? 'bold' : '600'
  }
});
