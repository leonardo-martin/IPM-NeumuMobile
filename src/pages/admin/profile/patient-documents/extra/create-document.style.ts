import { StyleSheet } from 'react-native'

const SPACING: number = 15

export const createDocStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexDirection: 'column',
    paddingHorizontal: SPACING,
    paddingVertical: SPACING,    
  },
  backdropDatepicker: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    paddingVertical: 5
  },
  label: {
    color: 'text-hint-color',
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "800",
    marginVertical: 4,
    textAlign: 'left'
  },
  textValue: {
    fontSize: 14,
    fontWeight: '600',
    paddingTop: 5,
    paddingBottom: 15
  },
  containerButton: {
    flexDirection: 'row',
    paddingVertical: SPACING
  },
  button: {
    width: '100%'
  },
})