import { StyleSheet } from 'react-native'

export const modalizeStyle = StyleSheet.create({
  safeArea: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
})
