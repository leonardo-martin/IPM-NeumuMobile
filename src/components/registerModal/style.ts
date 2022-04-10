import { StyleSheet } from 'react-native'

export const modalStyle = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '90%',
  },
  card: {
    width: '100%',
  },
  radio: {
    margin: 2,
  },
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    padding: 6,
    backgroundColor: '#3366FF',
  },
  containerButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  containerRadioGroup: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  icon: {
    color: 'text-basic-color'
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15
  }
})


