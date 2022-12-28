import { Platform, StyleSheet } from 'react-native'

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
    marginHorizontal: 10,
    borderRadius: 15,
  },
  cardDefault: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    lineHeight: 26,
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 18,
    paddingHorizontal: 30,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 15,
    minHeight: 100,
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: 10,
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
        elevation: 2,
      },
    }),
  },
})
