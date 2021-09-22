import { Platform, StyleSheet } from 'react-native'

export const drawerStyle = StyleSheet.create({
  drawerContent: {
    flex: 1
  },
  drawerSection: {
    marginTop: 15
  },
  drawerItem: {
    borderBottomRightRadius: Platform.OS === 'ios' ? 0 : 50,
    borderTopRightRadius: Platform.OS === 'ios' ? 0 : 50
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
    fontSize: 22,
    fontWeight: Platform.OS === 'ios' ? '400' : '600',
    marginHorizontal: 16
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 8
  }
})
