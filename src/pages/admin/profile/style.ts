import { Platform, StyleSheet } from 'react-native'

export const profileStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 24,
  },
  avatar: {
    width: 130,
    height: 130,
    borderWidth: 4,
    borderColor: 'border-alternative-color-5',
    alignSelf: 'center'
  },
  profileName: {
    fontSize: 22,
    fontWeight: Platform.OS === 'ios' ? '400' : '600'
  },
  body: {
    paddingTop: 10,
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
    alignItems: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  textFooter: {
    fontSize: 20
  },
  item: {
    marginVertical: 4,
  },
  icon: {
    color: 'text-info-color',
  },
  viewLocation: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
})