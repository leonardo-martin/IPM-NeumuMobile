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
  viewCard: {
    flexDirection: 'column',
    paddingVertical: 15
  },
  viewCardBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    minWidth: '40%'
  },
  attachDoc: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'background-basic-color-4',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'border-basic-color-2',
    borderRadius: 4
  },
  icon: {
    color: 'text-hint-color'
  },
  textFile: {
    color: 'text-basic-color'
  },
  iconRed: {
    color: 'color-danger-500'
  }
})

