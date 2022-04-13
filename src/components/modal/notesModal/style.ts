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
    justifyContent: 'space-between',
    paddingTop: 10
  },
  button: {
    minWidth: '40%'
  },
  icon: {
    color: 'text-basic-color'
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  }
})

