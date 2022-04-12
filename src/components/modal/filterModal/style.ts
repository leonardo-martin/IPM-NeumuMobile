import { StyleSheet } from 'react-native'

export const modalStyle = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  viewActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    paddingVertical: 5
  },
  modal: {
    width: '90%',
  },
  card: {
    alignItems: 'center'
  }
})


