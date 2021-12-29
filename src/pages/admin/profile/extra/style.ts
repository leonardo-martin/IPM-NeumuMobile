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
  },
  section: {
    marginTop: 24,
  },
  editButton: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 50,
    marginVertical: 5
  },
  avatar: {
    alignSelf: 'center',
    borderWidth: 4,
  },
})