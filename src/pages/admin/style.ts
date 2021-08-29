import { StyleSheet } from 'react-native'

export const dashboardStyle = StyleSheet.create({
  content: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#FAFAFA'
  },
  cardContainer: {
    width: '90%',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    height: '100%'
  },
  cardGroupPrimary: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  cardDefault: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    borderRadius: 5
  },
  cardText: {
    textAlign: 'center',
    color: '#626262',
    padding: 2,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 26,
    display: 'flex'
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#626262'
  }
})
