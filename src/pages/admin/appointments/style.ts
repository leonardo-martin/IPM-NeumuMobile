import { StyleSheet } from 'react-native'

export const appointmentsStyle = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FAFAFA'
  },
  contentContainerScrollView: {
    flexGrow: 1,
    height: '100%'
  },
  layoutContainer: {
    paddingBottom: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  content: {
    backgroundColor: '#FAFAFA'
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    width: '100%',
  }
})
