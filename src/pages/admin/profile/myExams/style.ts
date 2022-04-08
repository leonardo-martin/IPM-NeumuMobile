import { Dimensions, StyleSheet } from 'react-native'

const { width } = Dimensions.get('window')

export const myExamsStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center'
  },
  viewTop: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerItem: {
    height: 60,
    backgroundColor: 'text-control-color',
    justifyContent: 'center',
    padding: 16,
    width,
    marginTop: 4,
  },
  deleteBox: {
    backgroundColor: 'color-danger-500',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    marginVertical: 4,
  },
  text: {
    color: 'text-hint-color',
    fontWeight: 'bold',
  },
  icon: {
    color: 'color-basic-300',
  },
  iconFilter: {
    color: 'text-basic-color',
  },
  viewDate: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textDate: {
    textAlign: 'right',
    minWidth: 64
  }
})