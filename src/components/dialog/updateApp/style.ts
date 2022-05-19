import { StyleSheet } from 'react-native'

export const modalUpdateAppStyle = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '90%',
  },
  card: {
    width: '100%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spacing: {
    paddingBottom: 15
  },
  textProgress: {
    color: 'text-hint-color',
    fontWeight: '600'
  }
})


