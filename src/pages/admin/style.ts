import { Platform, StyleSheet } from 'react-native'

export const dashboardStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  title: {
    flex: .4,
    justifyContent: 'center'
  },
  content: {
    flex: .6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  cardGroupPrimary: {
    marginVertical: 10,
    width: '100%',
    borderRadius: 15,
  },
  cardDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignContent: 'center',
  },
  cardGroupSecondary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    borderRadius: 15,
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
    }),
  },
  cardInline: {
    height: 100,
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: 'solid'
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '47%',
    maxWidth: '90%',
    height: 120,
    maxHeight: 120,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 15,
  },
  cardText: {
    textAlign: 'center',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 26,
    display: 'flex',
    flexWrap: 'wrap',
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: 10,
  },
  iconOrange: {
    color: 'text-warning-color'
  },
  iconPrimary: {
    color: 'text-primary-color'
  },
  textConfirmExit: {
    textAlign: 'center',
    color: 'text-hint-color',
    fontSize: 20,
    marginVertical: 10
  },
  contentButton: {
    marginVertical: 15,
    paddingVertical: 15,
    width: '100%',
    backgroundColor: 'color-primary-default',
    borderRadius: 6,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: 'color-primary-default',
    borderWidth: 1
  },
  contentButtonText: {
    color: 'text-control-color',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextOutline: {
    color: 'text-primary-color',
  },
  shadowCard: {
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
        elevation: 1,
      },
    }),
  },
})
