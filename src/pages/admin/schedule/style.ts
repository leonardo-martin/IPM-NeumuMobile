import { StyleSheet } from 'react-native'

export const scheduleStyle = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  cardContainer: {
    width: '90%',
    justifyContent: 'center',
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
    marginVertical: 10
  }
})
