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
    flexWrap: 'wrap'
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10
  },
  icon: {
    
  }
})
