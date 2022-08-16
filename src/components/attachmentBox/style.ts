import { StyleSheet } from 'react-native'

export const attachBoxStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    alignItems: 'center'
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  attachDoc: {
    padding: 25,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'background-basic-color-3',
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
  iconPrimary: {
    color: 'color-primary-500'
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


