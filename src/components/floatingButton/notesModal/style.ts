import { StyleSheet } from 'react-native'

export const modalStyle = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  viewCard: {
    flexDirection: 'row',
    paddingVertical: 15
  },
  viewCardBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10
  },
  button: {
    minWidth: '40%'
  },
  icon: {
    color: 'text-basic-color'
  }
})


