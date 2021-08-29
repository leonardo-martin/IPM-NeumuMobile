import { StyleSheet } from 'react-native'

export const drawerStyle = StyleSheet.create({
  drawerContent: {
    flex: 1
  },
  drawerSection: {
    marginTop: 15
  },
  drawerItem: {
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50
  },
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileName: {
    marginHorizontal: 16
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 8
  }
})
