import { StyleSheet } from 'react-native'

export const professionalStyle = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: .9,
    paddingHorizontal: 15
  },
  saveButton: {
    flex: .1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  containerTitle: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase'
  },
  listItem: {
    borderColor: 'border-basic-color-5',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
    height: 50,
    width: 65,
  },
  listItemText: {
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  containerSchedule: {
    flex: 1,
    paddingVertical: 10
  },
  headerSchedule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingStart: 15,
    paddingEnd: 5
  },
  listContentContainerSchedule: {
    paddingStart: 15,
    paddingEnd: 5,
    backgroundColor: 'background-basic-color-2'
  },
  listStyle: {
    backgroundColor: 'transparent',
    marginTop: 15
  },
  uppercaseText: {
    textTransform: 'uppercase'
  },
  scheduleItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  scheduleItemText: {
    fontSize: 14
  },
  undoButton: {
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingEnd: 10
  },
  undoText: {
    fontSize: 10,
    fontWeight: '500'
  },
  freeAlert: {
    padding: 10,
    fontSize: 14,
    paddingHorizontal: 0,
    textAlign: 'center'
  }
})
