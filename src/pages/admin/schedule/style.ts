import { StyleSheet } from 'react-native'

export const scheduleStyle = StyleSheet.create({
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
    backgroundColor: '#FAFAFA'
  },
  cardGroupPrimary: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  cardDefault: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    color: '#626262',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 26,
    flexWrap: 'wrap',
    paddingHorizontal: 30,
  },
  card: {
    justifyContent: 'center',    
    alignItems: 'flex-start',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    height: 95
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#626262',
    marginVertical: 10
  }
})
