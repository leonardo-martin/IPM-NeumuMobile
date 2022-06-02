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
  },
  backdropDatepicker: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  downloadBtn: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: .5,
    borderRadius: 5,
    backgroundColor: 'background-basic-color-4',
    borderColor: 'border-primary-color-1'
  },
  downloadIcon: {
    color: 'text-primary-color'
  },
  label: {
    color: 'text-hint-color',
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "800",
    marginVertical: 4,
    textAlign: 'left'
  },
  textValue: {
    fontSize: 12,
    fontWeight: '600',
    paddingTop: 5,
    paddingBottom: 15
  },
  backdropSpinner: {
    position: 'absolute',
    flex: 1,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'background-basic-color-2',
    opacity: 0.6,
    marginVertical: 4
  },
})


