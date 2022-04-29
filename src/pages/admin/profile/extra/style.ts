import { StyleSheet } from 'react-native'

export const editProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  contentContainer: {
    paddingVertical: 24,
  },
  profileAvatar: {
    aspectRatio: 1.0,
    height: 130,
    alignSelf: 'center',
    borderColor: 'border-alternative-color-5',
  },
  editAvatarButton: {
    aspectRatio: 1.0,
    height: 30,
    borderRadius: 24,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
  },
  profileSetting: {
    padding: 16,
    paddingEnd: 5,
  },
  section: {
    marginTop: 24,
  },
  editViewButton: {
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingEnd: 20,
    paddingBottom: 0
  },
  avatar: {
    alignSelf: 'center',
    borderWidth: 4,
  },
})