import { Platform, StyleSheet } from 'react-native'

export const profileStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backdropSpinner: {
    position: 'absolute',
    flex: 1,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'background-basic-color-2',
    opacity: 0.6
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
    alignItems: 'center',
    backgroundColor: 'text-danger-color',
    borderRadius: 5
  },
  textFooter: {
    fontSize: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
    padding: 10,
    color: 'text-control-color'
  },
  item: {
    marginVertical: 4,
  },
  icon: {
    color: 'text-info-color',
  },
  iconExam: {
    color: 'text-control-color',
  },
  viewLocation: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listFooter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 30
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'background-alternative-color-1',
        shadowOffset: {
          width: 0,
          height: 5
        },
        shadowOpacity: .1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  }
})