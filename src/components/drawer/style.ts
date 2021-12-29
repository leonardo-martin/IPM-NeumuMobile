import { Platform, StyleSheet } from 'react-native'

export const drawerStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    paddingStart: 16,    
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
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10    
  },
})
