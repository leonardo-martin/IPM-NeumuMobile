import { StyleSheet } from 'react-native'

export const appointmentItemStyle = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  contentContainerScrollView: {
    flex: 1,
  },
  layoutContainer: {
    paddingBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%'
  },
  view: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    marginVertical: 20
  },
  viewCardInfo: {
    flex: 1
  },
  viewCardStatus: {
    alignSelf: 'center',
    padding: 8,
    borderRadius: 60
  },
  viewCard: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 12,
    width: '80%'
  },
  textStatus: {
    fontSize: 10,
    textAlign: 'right',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  viewNothingData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'

  }
})
