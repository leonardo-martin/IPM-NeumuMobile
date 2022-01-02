import { StyleSheet } from 'react-native'

export const dashboardStyle = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  cardContainer: {
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center'
  },
  cardGroupPrimary: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  cardDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignContent: 'center'
  },
  cardGroupSecondary: {
    flexDirection: 'row',
    alignContent: 'space-around',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '45%',
    maxWidth: '90%',
    height: 120,
    maxHeight: 120,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
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
    fontWeight: 'bold',
    marginVertical: 10
  },
  iconOrange: {
    color: 'text-warning-color'
  },
  iconPrimary: {
    color: 'text-primary-color'
  },
  safeAreaModalize: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  contentModalize: {
    padding: 20,
    backgroundColor: 'background-basic-color-2'
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
})
