import { StyleSheet } from 'react-native'

export const attachBoxStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: 'background-basic-color-3',
    borderColor: 'border-basic-color-5',
    borderWidth: .5,
    borderRadius: 4,
  },
  buttonDownload: {
    backgroundColor: 'color-primary-500',
    borderColor: 'border-basic-color-5',
    borderWidth: .5,
    borderRadius: 4,
  },
  buttonRemove: {
    backgroundColor: 'color-danger-500',
    borderColor: 'border-danger-color-2',
    borderWidth: .5,
    borderRadius: 4
  },
  icon: {
    color: 'text-hint-color'
  },
  textControl: {
    color: 'text-control-color',
  },
  iconControl: {
    color: 'color-control-default'
  },
  containerButton: {
    alignItems: 'center',
    padding: 25,
    minWidth: 100
  },
  label: {
    color: 'text-hint-color',
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
    textAlign: 'left'
  },
  containerFile: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  }
})


