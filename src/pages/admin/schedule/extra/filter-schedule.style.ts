import { StyleSheet } from 'react-native'

const SPACING = 20

export const filterScheduleStyle = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    padding: SPACING,
    paddingTop: 0
  },
  viewButton: {
    flexDirection: 'column',
  },
  button: {
    borderRadius: 50,
    marginVertical: 5
  },
  sppiner: {
    flex: 1,
    justifyContent: 'center'
  },
  input: {
    paddingVertical: 10,
    backgroundColor: 'background-basic-color-1'
  },
  text: {
    color: 'text-basic-color',
    alignItems: 'flex-start',
    fontSize: 12,
    padding: 4
  },
  messageNotFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING
  },
  messageNotFound: {
    textAlign: 'center'
  }
})
