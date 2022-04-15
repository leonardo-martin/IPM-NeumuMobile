import { StyleSheet } from 'react-native'

export const attachBoxStyle = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  attachDoc: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
    backgroundColor: 'background-basic-color-3',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'border-basic-color-5',
    borderRadius: 4
  },
  icon: {
    color: 'text-hint-color'
  },
  textFile: {
    color: 'text-basic-color',
    flexWrap: 'wrap',
    width: '70%',
    textAlign: 'center',
    paddingVertical: 5 
  },
  iconRed: {
    color: 'color-danger-500'
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
    justifyContent: 'center',
    alignItems: 'center',
  }
})


